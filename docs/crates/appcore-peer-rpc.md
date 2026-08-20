---
title: appcore-peer-rpc
sidebar_position: 17
---

# appcore-peer-rpc

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-peer-rpc/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-peer-rpc/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-peer-rpc)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** authenticated direct peer client, HTTP host, validation and
replay protection.

**Internal dependencies:** core, distributed contracts, security and transport.

**Primary API:** token issuer/authenticator/dispatcher traits and HashToken or
static implementations; in-memory/file nonce stores; validation config,
validator and signing/payload hashes; retry/client config and transport trait;
standard transport; HTTP state and host.

Use it only after tenant, cluster, source, target, protocol, expiry, nonce and
payload integrity can be established. `AllowPeerAuthenticator` is for tests,
not remote production.

Peer request, response, outbound and HTTP DTO `Debug` output reports payload
lengths and omits opaque bytes, credentials, nonce/idempotency values and remote
error details.

**Maturity:** stable peer protocol V1 surface.
