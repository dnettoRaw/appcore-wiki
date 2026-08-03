---
title: Synchronization, Logs, Checkpoints, and Replay
sidebar_position: 5
---

# Synchronization, Logs, Checkpoints, and Replay

AppCore synchronization is conservative leader-to-follower replication. It is not RAFT, not multi-master consensus, and not a domain conflict resolver.

That limitation is the point. The runtime can validate identity, protocol, sequence, hash chains, payload bounds, and checkpoints. It cannot decide whether two business edits are semantically compatible.

## The shop loses internet

Suppose a shop records work while offline. Local commands can still update local runtime/application state according to the deployment's storage and command policy. Sync does not pretend the network is present. It records durable progress locally and resumes exchange when a peer is reachable again.

When connectivity returns, the receiver does not trust the incoming batch merely because it came from a known peer. It checks:

- source identity compatibility;
- sequence range;
- declared event count;
- payload size;
- SHA-256 event hash;
- previous batch hash;
- replayed sequences;
- checkpoint state.

## The sync message

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

## Replication log

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

## Checkpoints

A checkpoint stores the last accepted sequence and batch hash per peer.

The file checkpoint store is intentionally small and line based:

```text
# appcore-sync-checkpoint-v1
peer-a=42,2f4c...
peer-b=17,
```

Peer IDs are bounded and restricted to ASCII alphanumeric plus `.`, `_`, `:`, and `-`. Hashes are either empty or 64 hex characters. The checkpoint file is bounded and atomically replaced.

Checkpoints answer a recovery question: "where did this receiver stop accepting a given peer's stream?" Without them, recovery would need to replay everything or guess from projected state.

## Replay

Replay is safe only if handlers and logs are idempotent at the right layer.

AppCore handles runtime replay by storing sequence and checkpoint state. If a peer resends a batch that has already been accepted, the receiver can recognize the sequence and hash. If bytes differ at the same sequence, that is not a retry; it is a conflict.

Application command idempotency is separate. A command may require an idempotency key before it is accepted by the runtime. Sync batch idempotency prevents duplicate replication. Both are needed because client retries and peer retries happen at different boundaries.

## Why there is no multi-master

Multi-master replication requires a domain conflict model. AppCore cannot know whether "reserve stock", "edit note", "approve quote", and "rotate secret" have the same conflict semantics. The runtime therefore keeps sync conservative and asks application code to own domain conflict policy.

Continue with [distributed operation](/en/architecture/distributed).

