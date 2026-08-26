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

The next-major file outbox uses the explicit binary marker
`appcore-sync-outbox-v2`. Each enqueue or acknowledgement appends and syncs one
bounded frame. Ordinals, leading/trailing lengths and a SHA-256 chain detect
corruption, duplication and reordering. Only an incomplete final frame is
truncated after a crash; a complete invalid frame fails closed.

Acknowledged space is reclaimed by an atomic compaction that writes only
pending messages and changes a generation identifier. Another process holding
an older in-memory view detects that generation change and reloads. The journal
stays capped at 64 MiB and reserves enough tail space to acknowledge an
accepted front message.

This is an explicit persistent-format boundary. V1, unversioned and future
files report `NO MORE SUPPORTED PLEASE UPDATE`; the Runtime does not guess or
convert. Operators must drain V1 before upgrading and drain V2 before rollback.

## What makes replay safe?

Replay is safe only if handlers and logs are idempotent at the right layer.

AppCore handles runtime replay by storing sequence and checkpoint state. If a peer resends a batch that has already been accepted, the receiver can recognize the sequence and hash. If bytes differ at the same sequence, that is not a retry; it is a conflict.

Application command idempotency is separate. A command may require an idempotency key before it is accepted by the runtime. Sync batch idempotency prevents duplicate replication. Both are needed because client retries and peer retries happen at different boundaries.

## Optional SQLite persistence after 1.0

The published post-1.0 `appcore-sync-sqlite 0.1.0-alpha.2` preview persists only Runtime sync records:
the replication log, outbox, per-peer checkpoints and opaque tombstones. It
uses a versioned internal schema, WAL, full synchronization, bounded
connections and limits, portable snapshots, verified online backup and a
fail-closed integrity scan. It never exposes arbitrary SQL or application
tables.

The provider supports independent local processes on a filesystem with
reliable locking. Network shares, multi-host SQLite and automatic selection by
the frozen V1 manifest are outside the contract. Unknown or future internal
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
