---
title: appcore-sync
sidebar_position: 12
---

# appcore-sync

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-sync/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-sync/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-sync)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** conservative leader-to-follower replication contracts and
local durability helpers.

**Internal dependencies:** `appcore-core`, `appcore-distributed-contracts`,
`appcore-ops`, `appcore-transport`.

**Primary API:** node role/status/peer/heartbeat and `SyncMessage`; V1 wire
codec; replication logs and snapshots; in-memory/file checkpoints and outbox;
receiver state/acknowledgement; follower client; HTTP transport; peer discovery;
retry policy, push metrics and `SyncError`.
Opaque content-envelope transport contracts are reexported for DNT-backed sync
packages without exposing plaintext to routing code. Their public
`MAX_OPAQUE_MESSAGE_ID_BYTES` retention limit is 1,024 UTF-8 bytes.

`HttpSyncTransport` owns a reusable bounded HTTP client. Use
`with_timeout_ms` for the uniform V1 deadline or `with_timeouts` for independent
connect/admission, read and write deadlines.

V1 wire encoding borrows the source identity, message and events while writing
the required output string. It does not retain a cloned batch beside that
output, and preserves the exact owned V1 JSON and source-node validation.

The `1.0.2-rc` snapshot API can consume owned sequence/payload pairs with
`ReplicationSnapshot::try_from_records`, moving each payload into the portable
V1 value. `ReplicationSnapshot::validate` checks the complete contract through
a shared reference, so persistent providers do not need a cloned payload
collection before restore.

Use it for compatible, ordered, hash-chained replication. Do not bypass
identity/protocol checks or reinterpret it as RAFT, multi-master consensus or a
business conflict resolver.

The file log is capped at 256 MiB and the outbox at 64 MiB. Checkpoint peer IDs
and hashes are validated on write and load. A receiver validates the complete
batch, sequence arithmetic and every record bound before any log or checkpoint
mutation, so a late invalid event cannot leave a partial append.

:::warning Next-major outbox update
The `1.0.2-rc` `FileSyncOutbox` accepts only the explicit
`appcore-sync-outbox-v2` binary journal. V1, unversioned and future files fail
with `NO MORE SUPPORTED PLEASE UPDATE`; there is no automatic conversion. Drain
V1 before upgrading and drain V2 before rollback. Enqueue and ACK then append
and sync one integrity-chained frame instead of rewriting the complete file.
The additive paging extension provides `peek`, payload-free `stats`, persisted
`mark_attempt`, `next_ready` and exact partial-prefix receipts. New consumers
use `pending_page`, `outbox_stats` and `flush_pending_with_progress`; V1 peer
wire remains unchanged.
:::

`InMemorySyncOutbox` measures exact JSON bytes with an overflow-checked writer
counter instead of allocating a second encoded message. For a valid 4 MiB batch
on Apple M1, p50 fell from 23.55 ms to 10.92 ms and peak RSS from 45.73 MiB to
17.52 MiB; page boundaries and `pending_bytes` remain exact.

`FileSyncOutbox` now measures receipt JSON and serializes it directly through a
fixed 64 KiB writer. The maximum escaped 1,024-ID fixture is 2,086,913 bytes and
is no longer retained as an additional production `Vec`; scans borrow IDs that
do not require JSON unescaping. Indexed IDs are also shared with transactional
tail-scan state, so refresh clones handles rather than every pending identifier.

The receiver's fixed 10,000-ID processed-batch window also shares each
`batch_id` between duplicate lookup and oldest-first eviction. Applying 10,000
batches with 128-byte IDs on Apple M1 measured 58.27 ms p50 and reduced peak RSS
from 17.45 MiB to 15.27 MiB without changing outcomes. Receiver and outbox
boundaries reject empty IDs, control characters and IDs above 1,024 UTF-8 bytes
before retention, so the window is bounded by bytes as well as item count.

**Maturity:** stable conservative profile with strict V1 decoding.
