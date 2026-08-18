---
title: appcore-control-plane
sidebar_position: 14
---

# appcore-control-plane

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-control-plane/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-control-plane/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-control-plane)
:::


**Responsibility:** generic presence, heartbeat, discovery and lease
implementations.

**Direct AppCore dependencies:** `appcore-contracts`, `appcore-core`, `appcore-distributed-contracts`, `appcore-transport`.

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

**Maturity:** stable RC contracts and reference implementations; external
service operation is deployment-owned.
