---
title: appcore-peer-rpc
sidebar_position: 16
---

# appcore-peer-rpc

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-peer-rpc/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-peer-rpc/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-peer-rpc)
:::


**Responsibility:** authenticated direct peer client, HTTP host, validation and
replay protection.

**Direct AppCore dependencies:** `appcore-core`, `appcore-distributed-contracts`, `appcore-security`, `appcore-transport`.

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

**Maturity:** stable peer protocol V1 RC surface.
