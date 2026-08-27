---
title: Crate Catalog
sidebar_position: 0
slug: /crates/
---

# Crate Catalog

AppCore `1.0.0` exposes **22 public crates**, all published on crates.io and all
declaring MSRV Rust `1.89`. Every public crate now owns independent SemVer;
one crate changing does not force unrelated packages to publish or adopt the
same version. Workspace tools such as
`appcore-certification`, `appcore-dev`, and `runtime-console` are not public
Runtime crates.

The separately versioned [`appcore-ai 0.1.0-beta.3`](./appcore-ai) public beta
is also published on crates.io. It is not part of the stable `1.0.0` Runtime
crate graph.

The optional [`appcore-sync-sqlite 0.1.0-alpha.2`](./appcore-sync-sqlite)
integration is a published post-1.0 prerelease. Its page documents the accepted
boundary and certification evidence without presenting it as part of the
stable catalog. The historical coordinated graph is available as
`2.0.0-alpha.1`; new candidates are versioned per crate and stable application
guidance remains on `1.0.0`.

The repository release train is currently `1.0.2-rc`, with compatible feature
work moving toward 1.5 only in the crates that own it:

| Candidate line | Crates |
|---|---|
| Existing independent releases | `appcore-ai 0.1.0-beta.3`, `appcore-args 1.0.1`, `appcore-supervisor 1.0.1`, `appcore-transport 1.1.0-alpha.1` |
| `0.1.0-alpha.3` | `appcore-sync-sqlite` |
| `1.0.2-rc` | contracts, types, DNT, core, ops, control plane, capabilities, provider contracts, Vercel/Neon adapter, update |
| `1.5.0-alpha.1` | API, security, storage, peer RPC |
| `2.0.0-alpha.2` | distributed contracts, sync, scheduler, Gateway, composition host; each retains a proven public break instead of being mislabeled as 1.5 |

Candidate means declared source, not already published. crates.io remains the
authority for available versions.

For a new application, depend on the high-level facade:

```bash
cargo add appcore-bin@1.0.0
```

Depend directly on another crate only when building a low-level consumer or a
provider adapter. Each page records the responsibility, dependency boundary,
important limits, registry links, and the crate-owned guide plus basic and
intermediate examples.

| # | Crate | Responsibility | Direct AppCore dependencies |
| ---: | --- | --- | --- |
| 1 | [appcore-args](./appcore-args) | Bounded CLI parsing, help, and completion | None |
| 2 | [appcore-contracts](./appcore-contracts) | Versioned manifests and policies | None |
| 3 | [appcore-types](./appcore-types) | Validated identity, trace, and errors | contracts |
| 4 | [appcore-transport](./appcore-transport) | Bounded HTTP/TLS transport | None |
| 5 | [appcore-supervisor](./appcore-supervisor) | Managed-service lifecycle and restart budgets | None |
| 6 | [appcore-distributed-contracts](./appcore-distributed-contracts) | Distributed wire/provider contracts | contracts, types |
| 7 | [appcore-dnt](./appcore-dnt) | Authenticated encrypted binary container | contracts, types |
| 8 | [appcore-core](./appcore-core) | Runtime lifecycle, registries, and dispatch | contracts, types |
| 9 | [appcore-api](./appcore-api) | HTTP Runtime host and DTOs | core, security, supervisor |
| 10 | [appcore-security](./appcore-security) | Tokens, secrets, keyring, and policy | core, DNT |
| 11 | [appcore-storage](./appcore-storage) | Storage contracts, file provider, and backup | contracts, DNT, security, types |
| 12 | [appcore-sync](./appcore-sync) | Conservative leader-to-follower replication | core, distributed contracts, ops, transport |
| 13 | [appcore-ops](./appcore-ops) | Health and vendor-neutral observability | core |
| 14 | [appcore-scheduler](./appcore-scheduler) | Bounded local scheduling and placement | contracts, core |
| 15 | [appcore-control-plane](./appcore-control-plane) | Presence, discovery, heartbeat, and leases | contracts, core, distributed contracts, transport |
| 16 | [appcore-capabilities](./appcore-capabilities) | Capability catalog, registry, and resolution | contracts, core, distributed contracts |
| 17 | [appcore-peer-rpc](./appcore-peer-rpc) | Authenticated peer calls and replay defense | core, distributed contracts, security, transport |
| 18 | [appcore-gateway](./appcore-gateway) | Tenant-isolated WebSocket and mesh relay | contracts, distributed contracts, peer RPC, security, transport, types |
| 19 | [appcore-provider](./appcore-provider) | Provider composition and shared leases | contracts |
| 20 | [appcore-provider-vercel-neon](./appcore-provider-vercel-neon) | Official isolated Vercel/Neon adapter | contracts, control plane, provider |
| 21 | [appcore-update](./appcore-update) | Artifact verification, activation, and rollback | contracts, provider |
| 22 | [appcore-bin](./appcore-bin) | Application facade, CLI, and composition root | 17 AppCore crates |

The dependency graph is acyclic. Public application code should normally stop
at `appcore_bin::application`; a published crate is not automatically the
recommended application-level integration surface.

The `appcore-ai` beta, the [appcore-ui](./appcore-ui) design preview, and future
components are tracked separately in the [Future Roadmap](/roadmap/) so
pre-stable and planned work are not confused with the stable crate graph.

## Documentation ownership

Runtime-wide architecture and integration guidance lives in this wiki. Detailed
crate APIs and the executable learning examples live under
`crates/<crate>/wiki` in the Runtime repository so changes can be reviewed with
the code that implements them. Every public crate provides a guide and examples
at basic and intermediate levels in English, Portuguese, and French.
