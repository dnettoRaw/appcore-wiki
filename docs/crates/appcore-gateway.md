---
title: appcore-gateway
sidebar_position: 18
---

# appcore-gateway

:::info Published package
Published **`1.0.1-rc.8`** · current Runtime workspace **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-gateway/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-gateway/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-gateway)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-gateway/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-gateway/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-gateway/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** tenant-isolated WebSocket relay for Gateway connections
between external clients and AppCore workers.

**Internal dependencies:** contracts, types, security, distributed
contracts and peer RPC.

**Primary API:** `GatewayConfig`, `GatewayState`, tenant state, capability
registry and resolver, bounded worker/client connection handles,
`MeshPeerTransport`, mesh relay request/response DTOs, heartbeat pruner and
Axum router factory. Opaque content-envelope transport contracts are reexported
for encrypted payload routing.

The gateway resolves a tenant from the deployment-owned domain suffix or an
explicit local-test query parameter, authenticates connections when configured,
routes Peer RPC envelopes and mesh-relayed Peer RPC HTTP requests only inside
the tenant partition, and tracks stale worker connections with bounded outbound
queues.

Authenticated upgrades accept credentials only in the `Authorization` header;
query credentials are rejected. Worker tokens use `worker_connection_hash` to
bind tenant, cluster, installation, Core and capabilities. Client tokens use
`client_connection_hash` to bind tenant, cluster and device. Both are one-use
`peer` tokens with a unique `jti`, a request hash and at most 60 seconds of
lifetime; the socket expires with the token.

The mesh relay validates its V1 schema and the inner Peer RPC routing metadata,
body digest and signed request hash before forwarding. Application payloads
remain opaque. Frames/messages are limited to 4 MiB; tenant, connection,
capability, pending-request, timeout, queue and concurrent-routing limits fail
closed. Heartbeats require the exact JSON heartbeat shape, and a worker response
is accepted only from the selected connection generation.

`mesh-relay` is a peer transport for Cores that keep outbound-only Gateway
connections instead of exposing local ports or stable IPs. It is not a
consensus system, public TLS terminator or production secret manager. Gateway
HA, edge relay federation and alternative transports remain future work and
must not weaken Peer RPC authentication, expiry, nonce or replay protections.

Replay/session state is process-local. Shared revocation/session state for
multi-instance Gateways is future provider work. Source-IP rate limiting and
TLS termination remain deployment controls. `GatewayConfig::new` enables
authentication. The only opt-out is `insecure_local_for_testing()`, which
rejects non-loopback listeners, and `GatewayState::new` validates the
configuration before constructing state.

Worker and client connection hashes use canonical V2 binary framing and carry
a `v2:` marker. Earlier unversioned hashes are not interchangeable; token
issuers and Gateway consumers must be upgraded together.

**Maturity:** RC peer transport profile for the V1 distributed surface.
