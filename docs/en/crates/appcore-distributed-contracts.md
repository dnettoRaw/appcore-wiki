---
title: appcore-distributed-contracts
sidebar_position: 5
---

# appcore-distributed-contracts

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-distributed-contracts/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-distributed-contracts/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-distributed-contracts)
:::


**Responsibility:** versioned control-plane and peer RPC wire/provider
contracts.

**Direct AppCore dependencies:** `appcore-contracts`, `appcore-types`.

**Primary API:** control-plane protocol constants and paths, registration,
presence, heartbeat, peer directory, global compatibility leases,
service-scoped leases, leadership decisions and provider traits; peer protocol
paths, envelopes, responses, errors, call kinds, advertisement DTOs, client
executor trait and opaque content-envelope transport metadata.

Implementations belong in control-plane or peer crates. Do not add HTTP clients,
filesystem state, tokens or product capability rules here.

Opaque-content and Peer RPC wire serialization is unchanged. Their `Debug`
implementations expose lengths and routing metadata instead of opaque payload
bytes, nonce/idempotency values or remote error details.

**Maturity:** stable V1 wire contract; serialized compatibility is strict.
