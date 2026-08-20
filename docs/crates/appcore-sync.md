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

Use it for compatible, ordered, hash-chained replication. Do not bypass
identity/protocol checks or reinterpret it as RAFT, multi-master consensus or a
business conflict resolver.

The file log is capped at 256 MiB and the outbox at 64 MiB. Checkpoint peer IDs
and hashes are validated on write and load. A receiver validates the complete
batch, sequence arithmetic and every record bound before any log or checkpoint
mutation, so a late invalid event cannot leave a partial append.

**Maturity:** stable conservative profile with strict V1 decoding.
