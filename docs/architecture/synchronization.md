---
title: Synchronization, Logs, Checkpoints, and Replay
sidebar_position: 5
---

# Synchronization, Logs, Checkpoints, and Replay

Imagine that a shop loses internet for eight hours. The operator keeps issuing quotations. At the end of the day the network returns, and a peer asks for the missing records.

The runtime now has to answer concrete questions:

- Which records were already sent before the outage?
- Which records are new?
- Is this resend a harmless retry or a conflicting payload?
- Did the previous accepted batch match the sender's chain?
- Where should replay resume after a crash?

AppCore synchronization is conservative leader-to-follower replication. It is not RAFT, not multi-master consensus, and not a domain conflict resolver.

That limitation is the point. The runtime can validate identity, protocol, sequence, hash chains, payload bounds, and checkpoints. It cannot decide whether two business edits are semantically compatible.

## What happens when the shop reconnects?

Suppose a shop records work while offline. Local commands can still update local runtime/application state according to the deployment's storage and command policy. Sync does not pretend the network is present. It records durable progress locally and resumes exchange when a peer is reachable again.

When connectivity returns, the receiver does not trust the incoming batch merely because it came from a known peer. A valid source identity is only the start. The receiver checks:

- source identity compatibility;
- sequence range;
- declared event count;
- payload size;
- SHA-256 event hash;
- previous batch hash;
- replayed sequences;
- checkpoint state.

The result is intentionally mechanical. If a batch is a retry, AppCore can recognize it. If the same sequence contains different bytes, AppCore refuses to pretend it is a retry.

## What does a sync message prove?

A replication batch carries:

- `batch_id`, used as idempotency identity for the batch;
- source node ID;
- inclusive `sequence_start` and `sequence_end`;
- declared event count;
- event hash over metadata and size-prefixed payloads;
- creation time;
- optional previous batch hash;
- opaque event payloads.

The hash includes metadata and payload lengths. This prevents a receiver from accepting the same bytes under different sequence metadata.

```mermaid
flowchart LR
    LeaderLog[Leader replication log] --> Batch[SyncMessage]
    Batch --> Hash[Metadata + payload hash]
    Hash --> Transport[Transport]
    Transport --> Receiver[Receiver validation]
    Receiver --> FollowerLog[Follower replication log]
    FollowerLog --> Checkpoint[Per-peer checkpoint]
```

The batch proves consistency of transport-level replication. It does not prove that the business event is semantically correct. That distinction is essential: runtime sync can protect order and integrity, while application code owns domain meaning.

## Why keep a replication log?

The replication log has in-memory and file-backed implementations.

The file-backed log:

- uses a stable format marker: `# appcore-replication-log-v1`;
- bounds total log bytes;
- bounds individual record bytes;
- stores records with sequence and hash-chain metadata;
- reloads and validates durable records before appending;
- uses process locks and atomic writes for persistence;
- can recover a valid prefix if a tail was interrupted.

Appending with a source sequence is idempotent. If the same sequence already exists with the same payload, the append returns the original index. If the same sequence exists with different payload bytes, the log reports a sequence conflict.

The log is the evidence used by replay. Without it, a receiver would have to trust projected application state, which may have been compacted, migrated, or partially rebuilt.

## Why checkpoints exist if replay exists?

A checkpoint stores the last accepted sequence and batch hash per peer.

The file checkpoint store is intentionally small and line based:

```text
# appcore-sync-checkpoint-v1
peer-a=42,2f4c...
peer-b=17,
```

Peer IDs are bounded and restricted to ASCII alphanumeric plus `.`, `_`, `:`, and `-`. Hashes are either empty or 64 hex characters. The checkpoint file is bounded and atomically replaced.

Checkpoints answer a recovery question: "where did this receiver stop accepting a given peer's stream?" Without them, recovery would need to replay everything or guess from projected state.

Replay alone is not enough because the log can be larger than the useful recovery point, and projections are not always authoritative. A checkpoint is a small, explicit promise: all batches up to this sequence and hash were accepted for this peer.

## How does the durable outbox recover?

The `1.0.2-rc` file outbox uses the explicit binary marker
`appcore-sync-outbox-v2`. Each enqueue or acknowledgement appends and syncs one
bounded frame. Ordinals, leading/trailing lengths and a SHA-256 chain detect
corruption, duplication and reordering. Only an incomplete final frame is
truncated after a crash; a complete invalid frame fails closed.

Acknowledged space is reclaimed by an atomic compaction that writes only
pending messages and changes a generation identifier. Another process holding
an older in-memory view detects that generation change and reloads. The journal
stays capped at 64 MiB and reserves enough tail space to acknowledge an
accepted front message.

The `1.0.2-rc` outbox contract reads an ordered prefix with independent count
and encoded-byte bounds before cloning payloads. It exposes payload-free stats,
persists retry attempts/readiness and applies only exact ordered-prefix
receipts. The Runtime follower and CLI use this path directly, so queue growth
does not determine one delivery allocation or checkpoint progress.

This is an explicit persistent-format boundary. V1, unversioned and future
files report `NO MORE SUPPORTED PLEASE UPDATE`; the Runtime does not guess or
convert. Operators must drain V1 before upgrading and drain V2 before rollback.

## What makes replay safe?

Replay is safe only if handlers and logs are idempotent at the right layer.

AppCore handles runtime replay by storing sequence and checkpoint state. If a peer resends a batch that has already been accepted, the receiver can recognize the sequence and hash. If bytes differ at the same sequence, that is not a retry; it is a conflict.

Application command idempotency is separate. A command may require an idempotency key before it is accepted by the runtime. Sync batch idempotency prevents duplicate replication. Both are needed because client retries and peer retries happen at different boundaries.

## Optional SQLite persistence after 1.0

The published post-1.0 `appcore-sync-sqlite 0.1.0-alpha.6` preview persists only Runtime sync records:
the replication log, outbox, per-peer checkpoints and opaque tombstones. It
uses a versioned internal schema, WAL, full synchronization, bounded
connections and limits, portable snapshots, verified online backup and a
fail-closed integrity scan. It never exposes arbitrary SQL or application
tables.

The provider supports independent local processes on a filesystem with
reliable locking. Network shares, multi-host SQLite and automatic selection by
the stable V1 manifest are outside the contract. Unknown or future internal
schemas return `NO MORE SUPPORTED PLEASE UPDATE`; there is no inferred import
from file-provider formats. See the
[`appcore-sync-sqlite` preview](../crates/appcore-sync-sqlite).

## Why doesn't AppCore resolve conflicts automatically?

Multi-master replication requires a domain conflict model. AppCore cannot know whether "reserve stock", "edit note", "approve quote", and "rotate secret" have the same conflict semantics. The runtime therefore keeps sync conservative and asks application code to own domain conflict policy.

## Limitations

- Sync is leader-to-follower replication, not RAFT and not multi-master consensus.
- AppCore detects sequence/hash conflicts; it does not merge conflicting business changes.
- Checkpoints prove runtime acceptance progress, not that downstream domain projections are correct.
- Replay safety depends on handlers respecting idempotency boundaries.
- V1 and V2 file outboxes are not mutually readable; both update and rollback
  require an empty durable queue.
- Network partitions are handled conservatively; AppCore does not promise continuous global availability for writes that require leadership.

Continue with [distributed operation](/architecture/distributed).

## Opaque revision causality

`ObjectRevisionV1`, `RevisionChainV1` and `decide_object_revision_v1` classify `already_applied`, `ancestor_echo`, `applicable`, `concurrent_branch` and `snapshot_required`. The chain contains at most 1,024 revisions with 128-byte identity fields. Authenticate every event and bind its tenant before constructing evidence: chain validation is structural, not cryptographic. Missing links, cycles, object mismatch and reused event/revision identities fail closed. Equality of content or timestamps never establishes ancestry. An intentional revert uses a fresh revision/event. Advance the transport checkpoint independently when accepting an ancestor echo; call `validate_checkpoint_head_v1` before mutating metadata.

## Composed commits and recoverable objects (schema V3)

`SqliteSyncStore::transaction` exposes a bounded `SqliteSyncWork` for log append, outbox enqueue, checkpoint and `stage_object_write`, in one immediate SQLite transaction with at most 1,024 operations. Propagate every error; callback failure/unwind rolls back. Do not reenter the store or perform network/filesystem work inside the callback. Full outbox is an error in this composition. Checkpoints require an authenticated observed head. `conflict_store` persists bounded evidence and idempotent resolution using existing Sync contracts (at most 4,096 conflicts). Known owned schemas V1/V2 migrate to V3; ownership is checked before migration. Unknown/foreign schemas fail at the version wall. Preserve a verified pre-V3 backup for rollback; older binaries must not open V3. Do not open an application database as this provider or infer compatibility between different rusqlite versions.

`ObjectWriteIntentV1` journals encrypted/opaque envelopes up to 1 MiB, installation and opaque object key alongside outbox work. There are at most 4,096 intents; pages admit at most 1,024 records/16 MiB before payload reads. Replay committed intents in FIFO order with `pending_object_writes`, map keys through a safe application-owned path policy, atomically publish/sync/reverify each envelope, then call `acknowledge_object_write` with observed digest. Serialize object writes in the deployment and never reuse completed intent IDs. Ack records caller evidence, not independent filesystem verification. No universal filesystem/SQLite atomicity is promised. Online backup includes conflicts/intents; bind a combined filesystem/SQLite backup manifest to installation identity outside this provider.

## Retransmission and checkpoint serialization

Unpublished source fix: an identical authenticated replay returns an accepted ACK with zero new records; divergent reuse of a retained `batch_id` fails with `divergent batch_id reuse`. The receiver retains at most 10,000 ID/digest pairs. This window is process-local, not permanent replay evidence; after restart or eviction the existing old-sequence checkpoint policy applies. Authenticate and isolate the source before calling the receiver. Distinct receiver states must share the same replication-log handle when they share checkpoints.

Checkpoint observation, overlap verification, log append and sequence/hash publication share the log lock. Concurrent batches cannot publish a stale smaller checkpoint or combine one batch’s sequence with another batch’s hash. Provider errors can still leave an appended log with an older checkpoint; an identical retry verifies overlap before publishing the checkpoint. The sender removes its outbox receipt only after transport acknowledgement. Losing the first ACK therefore causes a safe retransmission and eventual drain. External processes and independent log handles require provider/deployment transaction coordination.
