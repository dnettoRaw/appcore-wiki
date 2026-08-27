---
title: appcore-gateway
sidebar_position: 18
---

# appcore-gateway

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-gateway/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-gateway/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-gateway)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** tenant-isolated WebSocket relay for Gateway connections
between external clients and AppCore workers.

**Internal dependencies:** contracts, types, security, distributed
contracts and peer RPC.

**Primary API:** `GatewayConfig`, `GatewayState`, tenant state, capability
registry and resolver, bounded worker/client connection handles,
`MeshPeerTransport`, mesh relay request/response DTOs, heartbeat pruner and
Axum router factory. Opaque content-envelope transport contracts are reexported
for encrypted payload routing.

> **Next-major migration:** direct access to `GatewayState::tenants` has been
> removed so unrelated tenants no longer share one lock. Use
> `tenant_partition`, `tenant_partition_or_insert`, `tenant_count` and
> `connection_count`. The former pending maps are private; use
> `pending_request_count` for observation and let `EnvelopeRouter` own their
> lifecycle. This change is reserved for the next SemVer major and
> must not be published as 1.0.x.

The gateway resolves a tenant from the deployment-owned domain suffix or an
explicit local-test query parameter, authenticates connections when configured,
routes Peer RPC envelopes and mesh-relayed Peer RPC HTTP requests only inside
the tenant partition, and tracks stale worker connections with bounded outbound
queues.

The normal Runtime activation path is the existing deployment adapter map:

```toml
[adapters.gateway]
provider_id = "appcore-gateway"
settings = { bind_address = "127.0.0.1:8080", domain_suffix = "gateway.example.com", heartbeat_interval_ms = "30000", heartbeat_timeout_ms = "90000" }
secret_refs = {}
```

Cluster mode additionally requires absolute `paths.gateway_replay` to name one file on
a writable volume shared by every Gateway instance.

The parser accepts only those four non-secret settings. Endpoints, secret
references, unknown settings and authentication overrides fail closed.
`appcore-bin` adds and authorizes the owner descriptor `runtime.gateway` in the
shared capability catalog, reuses Runtime security and registers the instance
as a critical Supervisor-managed service. Without `adapters.gateway`, it
creates no Gateway runtime, listener or task.

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
consensus system, public TLS terminator or production secret manager. Edge
relay federation and alternative transports must not weaken Peer RPC
authentication, expiry, nonce or replay protections.

The Runtime host uses a durable, process-safe `FilePeerNonceStore`: standalone
places it in private Runtime storage, while cluster fails closed unless
absolute `paths.gateway_replay` selects a shared writable file. Active sockets expire in
at most 60 seconds. Direct embedders may inject another `PeerNonceStore`; their
default is bounded and process-local. Source-IP rate limiting and TLS
termination remain deployment controls.

`GatewayRuntime` owns its listener, current-thread Tokio runtime, router,
heartbeat pruner and runtime thread. Startup binds synchronously, so an invalid
or occupied address aborts host startup. Bounded cooperative shutdown joins all
owned work. Before the deadline it force-drops the server future, closing slow
or incomplete connections before joining the thread. `Orphaned` is only a
defensive thread-failure quarantine. Safe snapshots contain lifecycle state,
bind addresses and counters only. Direct users of
`spawn_heartbeat_pruner` must retain and await the returned join handle.

Worker and client connection hashes use canonical V2 binary framing and carry
a `v2:` marker. Earlier unversioned hashes are not interchangeable; token
issuers and Gateway consumers must be upgraded together.

Each tenant keeps bounded direct worker indexes by Core ID and by
`(cluster_id, core_id)`. Routing lookup is O(1); register, reconnect,
disconnect and heartbeat pruning update the primary map, capability registry
and indexes under the same tenant lock. Saturating rebuild and inconsistency
counters expose index health without unbounded labels.

## `1.0.2-rc`: Redis HA registry

This is development status, not functionality in the stable `1.0.0` package.
The private Runtime beta through
[`deff156`](https://github.com/dnettoRaw/AppCore-Runtime/commit/deff156)
defines `GatewayRegistryProvider`, implements `RedisGatewayRegistryProvider`
and adds the bounded `GatewayHaCoordinator`. It uses monotonic tenant-local instance epochs,
exact instance/worker-generation fences, one Redis Cluster hash slot per
tenant, bounded timeouts/concurrency and separately resolved zeroizing
credentials. Plain Redis endpoints are loopback-only; remote endpoints require
`rediss://`. An ambiguous mutation is never retried automatically.

The provider caps each tenant at 1,024 workers, 4,096 sessions and 2,048
pending requests. A real Redis 7.4 conformance run passed two-provider
ownership, tenant isolation, schema rejection, stale/duplicate completion,
all three capacity walls, connection kill, explicit reconnect and recovery
with a higher epoch. Windows GNU cross-compilation passed; the macOS-hosted
Linux cross-check lacked a Linux OpenSSL sysroot and is not Linux evidence.

The lifecycle gate in
[`756b794`](https://github.com/dnettoRaw/AppCore-Runtime/commit/756b794)
rejects HTTP/WebSocket admission, dispatch and response completion outside
`Healthy`. The coordinator acquires every configured tenant epoch before
`Healthy`, renews or rolls back the exact set in serialized rounds, and limits
each round to 64 concurrent operations and five seconds. Unconfigured
single-instance state keeps its existing behavior.

The Runtime now owns that task and replays every bounded live worker and
unexpired session before `Healthy`. New sockets reach shared ownership before
local admission; disconnect, heartbeat pruning and shutdown remove exact
records. The local route now claims origin/target epochs and worker generation before
dispatch, completes before returning success, and cancels on queue failure,
timeout or shutdown. Owner-aborted futures leave only a 30-second TTL-bounded
record. Fixed counters expose claims/completions/cancellations without request
labels.

The authenticated V2 federation endpoint now binds the exact request body,
source/target epochs and worker generation to a separate short-lived one-use
credential. The target validates the shared claim before touching the socket,
returns typed AC-021 errors, and the origin completes the fence before accepting
the response. The combined E2E uses two Gateway states, independent Redis 7.4
connections and Caddy 2.11.4 as the only advertised route to the target. It
drops the owner ungracefully, waits for the bounded lease TTL, reacquires a
higher epoch and routes through Caddy again in under five seconds. The clean
AC-022 local report at `7197416` passed
all subsystems: shared lookup stayed at 0.58--0.67 us p99, 1,000-tenant
recovery at 2.25 ms p99, local fenced routing at 0.35 ms p99 and federated
routing at 0.91 ms p99. Linux and Windows CI evidence remains required before
the HA profile is deployable, and it must never fall back locally. Track
[public AC-013](https://github.com/dnettoRaw/app-core-public/issues/15).

## `1.0.3-rc`: bounded worker selection

`FirstAvailable` remains the default and now chooses in stable worker-identity
order instead of process-random `HashSet` order. The exhaustive V1
`SelectionPolicy` remains limited to `FirstAvailable`; the new non-exhaustive
`WorkerSelectionPolicy` carries opt-in `RoundRobin`, `LeastInflight`,
`HealthWeighted` and `Affinity` policies. Consumers of the earlier RC draft
only replace the enum name; manifests and wire contracts do not change.
`CapabilityResolver::select` considers only the current tenant's advertised
workers and returns typed failures for an absent capability, no healthy worker,
all workers at capacity, or invalid affinity.

Health is bounded by heartbeat age; least-inflight also uses outbound queue
depth as a deterministic tie-breaker. Affinity accepts at most 128 bytes and
uses stateless tenant-local rendezvous hashing, so it retains no growing key
map. Selection happens before the caller signs a Peer RPC envelope. Gateway
dispatch never rewrites its V1 target and independently acquires a permit for
at most 64 concurrent routes per worker, released on every terminal path.

The final clean macOS/aarch64 gate at
[`7caddc1`](https://github.com/dnettoRaw/AppCore-Runtime/commit/7caddc1510e2cf88059c0dedaf3df0144d1e197b)
measured 17,125 ns round-robin p99, 18,542 ns least-inflight p99 and 38,083 ns
affinity p99 across 64 workers. Exact round-robin distribution, health,
capacity and stateless-affinity invariants passed. This is repository-local
evidence, not production or cross-platform certification.

## `1.0.2-rc`: bounded routing telemetry

The current RC exposes a vendor-neutral pull snapshot through
`GatewayMetrics::telemetry_snapshot` and an explicit
`GatewayTelemetryExporter` boundary. It records fixed route outcomes,
inflight/peak routes, queue saturation, reconnects, retries, authentication and
export failures, plus fixed-bucket route latency, worker wait, lock wait and
payload observations. Capability cardinality is capped at 128 series; further
validated names are combined in the fixed
`appcore.gateway.capability.overflow` series. Tenant, connection, request,
token and payload values never become labels.

Routing never invokes an exporter. Deployment-owned Prometheus or
OpenTelemetry adapters pull the owned snapshot and control their own queue,
retry and transport policy. A clean release-profile certification at
[implementation commit `31c4fbe`](https://github.com/dnettoRaw/AppCore-Runtime/commit/31c4fbec34d403770bf59dfe76d36732cb9b4450)
measured 1,792 ns p99 for an instrumented unavailable-worker route and 5,792 ns
p99 for a 129-series snapshot, against budgets of 1 ms and 5 ms respectively.
These measurements are repository-local evidence, not production traffic or
collector certification.

**Maturity:** stable peer transport profile for the V1 distributed surface.
