---
title: Crate Catalog
sidebar_position: 0
slug: /en/crates/
---

# Crate Catalog

AppCore Runtime `1.0.1-rc.8` consists of **21 Runtime crates**. All 21 were
verified as published on crates.io on August 18, 2026 and declare MSRV Rust
`1.89`. The two workspace tools, `appcore-certification` and `runtime-console`,
are operational tooling and are not counted as Runtime crates.

For a new application, depend on the high-level facade:

```bash
cargo add appcore-bin@1.0.1-rc.8
```

Depend directly on another crate only when building a low-level consumer or a
provider adapter. Each page below records the crate responsibility, direct
AppCore dependencies, primary API, limits, maturity, and exact crates.io and
docs.rs links.

| # | Crate | Responsibility | Direct AppCore dependencies |
| ---: | --- | --- | --- |
| 1 | [appcore-contracts](./appcore-contracts) | Versioned manifests and policies | None |
| 2 | [appcore-types](./appcore-types) | Validated identity, trace, and errors | contracts |
| 3 | [appcore-transport](./appcore-transport) | Bounded HTTP/TLS transport | None |
| 4 | [appcore-supervisor](./appcore-supervisor) | Managed-service lifecycle and restart budgets | None |
| 5 | [appcore-distributed-contracts](./appcore-distributed-contracts) | Distributed wire/provider contracts | contracts, types |
| 6 | [appcore-dnt](./appcore-dnt) | Authenticated encrypted binary container | contracts, types |
| 7 | [appcore-core](./appcore-core) | Runtime lifecycle, registries, and dispatch | contracts, types |
| 8 | [appcore-api](./appcore-api) | HTTP Runtime host and DTOs | core, security, supervisor |
| 9 | [appcore-security](./appcore-security) | Tokens, secrets, keyring, and policy | core, DNT |
| 10 | [appcore-storage](./appcore-storage) | Storage contracts, file provider, and backup | contracts, DNT, security, types |
| 11 | [appcore-sync](./appcore-sync) | Conservative leader-to-follower replication | core, distributed contracts, ops, transport |
| 12 | [appcore-ops](./appcore-ops) | Health and vendor-neutral observability | core |
| 13 | [appcore-scheduler](./appcore-scheduler) | Bounded local scheduling and placement | contracts, core |
| 14 | [appcore-control-plane](./appcore-control-plane) | Presence, discovery, heartbeat, and leases | contracts, core, distributed contracts, transport |
| 15 | [appcore-capabilities](./appcore-capabilities) | Capability registry and resolution | contracts, core, distributed contracts |
| 16 | [appcore-peer-rpc](./appcore-peer-rpc) | Authenticated peer calls and replay defense | core, distributed contracts, security, transport |
| 17 | [appcore-gateway](./appcore-gateway) | Tenant-isolated WebSocket and mesh relay | contracts, core, distributed contracts, peer RPC, security, transport, types |
| 18 | [appcore-provider](./appcore-provider) | Provider composition and shared leases | contracts |
| 19 | [appcore-provider-vercel-neon](./appcore-provider-vercel-neon) | Official isolated Vercel/Neon adapter | contracts, control plane, provider |
| 20 | [appcore-update](./appcore-update) | Artifact verification, activation, and rollback | contracts, provider |
| 21 | [appcore-bin](./appcore-bin) | Application facade, CLI, and composition root | 15 Runtime crates |

The dependency graph is acyclic. Public application code should normally stop
at `appcore_bin::application`; a published crate is not automatically the
recommended application-level integration surface.
