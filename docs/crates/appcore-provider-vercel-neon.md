---
title: appcore-provider-vercel-neon
sidebar_position: 20
---

# appcore-provider-vercel-neon

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-provider-vercel-neon/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-provider-vercel-neon)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-provider-vercel-neon/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-provider-vercel-neon/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-provider-vercel-neon/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** isolated official factory for the Vercel API control-plane
adapter backed by externally operated Neon coordination.

**Internal dependencies:** contracts, control plane and provider.

**Primary API:** `VERCEL_NEON_PROVIDER_ID`, `AUTH_TOKEN_SECRET`, shared
control-plane client type and `VercelNeonControlPlaneFactory`.

Runtime nodes receive only the Vercel endpoint and an auth-token secret
reference. Neon credentials, schema operations, backup and retention stay in
the external service.

**Maturity:** supported adapter; production certification includes the
separately operated backend.

## Independent prerelease — 2026-10-14

`1.0.4-rc.2`: dependency metadata alignment.

[crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.4-rc.2) · [docs.rs](https://docs.rs/appcore-provider-vercel-neon/1.0.4-rc.2)

## Negotiated HA availability — 1.0.4-rc.4

This RC cohort aligns shared distributed types across Sync, Peer RPC, control plane,
Gateway, Transfer, SQLite and the SDK. `peer.availability.v1` selects authenticated
structured outcomes without changing frozen V1 wire shapes. Busy admission never runs
the business closure or confirms work. Rejection, pending execution, transport failure
and durable completion remain distinct; retries preserve the same idempotency identity.
The deployment owns business completion, exact write fencing and required replica proof.
No installation migration, deployment or physical power-loss certification is implied.

See the [crate-owned availability guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-peer-rpc/wiki/guide.en.md).
