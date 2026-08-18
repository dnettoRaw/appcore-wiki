---
title: appcore-gateway
sidebar_position: 17
---

# appcore-gateway

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-gateway/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-gateway/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-gateway)
:::


**Responsibility:** tenant-isolated WebSocket relay for Gateway connections
between external clients and AppCore workers.

**Direct AppCore dependencies:** `appcore-contracts`, `appcore-core`, `appcore-distributed-contracts`, `appcore-peer-rpc`, `appcore-security`, `appcore-transport`, `appcore-types`.

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
TLS termination remain deployment controls. `require_auth = false` is an
explicit insecure mode.

**Maturity:** RC peer transport profile for the V1 distributed surface.
