---
title: appcore-control-plane
sidebar_position: 15
---

# appcore-control-plane

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-control-plane/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-control-plane/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-control-plane)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-control-plane/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-control-plane/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-control-plane/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** generic presence, heartbeat, discovery and lease
implementations.

**Internal dependencies:** contracts, core, distributed contracts and
transport.

**Primary API:** in-memory, file and offline control-plane clients; HTTP request
configuration, retry policy and transport trait; standard/bearer HTTP
transports; coordinator and heartbeat policy; static global/service leadership
guards; secure endpoint validation.

Use it to implement distributed coordination without business payloads.
File-backed profiles require certified locking/storage semantics. Remote
profiles require deployment TLS and authentication.

The file profile caps state and backup input at 16 MiB and rejects malformed or
future state. Expiry and epoch arithmetic is checked; epoch exhaustion fails
closed instead of reusing a fencing token.

**Maturity:** stable contracts and reference implementations; external
service operation is deployment-owned.
