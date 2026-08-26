---
title: appcore-distributed-contracts
sidebar_position: 6
---

# appcore-distributed-contracts

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-distributed-contracts/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-distributed-contracts/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-distributed-contracts)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** versioned control-plane and peer RPC wire/provider
contracts.

**Internal dependencies:** `appcore-contracts`, `appcore-types`.

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

## Peer RPC V2 chunk frames

The post-1.0 `peer_rpc::v2` module defines an explicit open/chunk/commit/cancel
frame family. Open binds aggregate decoded bytes, chunk size/count and deadline;
each chunk binds sequence, exact decoded length and digest; commit binds the
complete decoded payload digest. Encoded chunk bytes use a canonical base64 JSON
string rather than an integer array. V1 and V2 stay in separate modules and
routes, with no detection, conversion or fallback.

:::warning Development contract
The V2 DTO, codec, bounded registry and signed host/client integration passed
clean-source release certification at `8d26cc3`. V2 remains unpublished on the
post-1.0 development line. Continue using explicit V1 routes until that release
is announced.
:::
