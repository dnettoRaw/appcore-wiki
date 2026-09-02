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
packages without exposing plaintext to routing code.

`HttpSyncTransport` owns a reusable bounded HTTP client. Use
`with_timeout_ms` for the uniform V1 deadline or `with_timeouts` for independent
connect/admission, read and write deadlines.

V1 wire encoding borrows the source identity, message and events while writing
the required output string. It does not retain a cloned batch beside that
output, and preserves the exact owned V1 JSON and source-node validation.

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

**Maturity:** stable conservative profile with strict V1 decoding.
