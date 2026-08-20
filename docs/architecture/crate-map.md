---
title: Crate Map
sidebar_position: 12
---

# Crate Map

When a runtime grows, crate boundaries either explain the architecture or hide it. AppCore crates are split by ownership boundary, not by convenience.

The stable `1.0.0` release contains 22 public crates, all published on
crates.io. Standalone foundations retain independent SemVer even when their
release numbers align with the Runtime. The complete reference is available in
the [crate catalog](/crates/).

| Layer | Crates | Why it exists |
| --- | --- | --- |
| Standalone foundations | `appcore-args`, `appcore-supervisor`, `appcore-transport` | independently versioned reusable components with no AppCore dependencies |
| Contracts | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` | manifests, validated identities, wire contracts, and provider composition contracts |
| Runtime | `appcore-core`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-api`, `appcore-update` | Runtime behavior and infrastructure, each with an explicit ownership boundary |
| Integrations | `appcore-gateway`, `appcore-provider-vercel-neon` | externally operated transport/provider integrations |
| Composition | `appcore-bin` | the only crate allowed to compose concrete runtime infrastructure for applications |
| Tools | `appcore-dev`, `runtime-console`, certification tools | development, operator, and release evidence workflows; not public Runtime crates |

Standalone foundations remain reusable and independently versioned. In
particular, `appcore-supervisor` manages in-process services without depending
on command dispatch, and `appcore-args` parses CLI input without executing
Runtime commands.

The architecture rule is acyclic dependency direction. Contracts do not depend on implementations. Business code depends on the public application facade, not private host modules.

## How should you read this map?

Start from the host and move downward. `appcore-bin` composes concrete runtime infrastructure. It depends on contracts, providers, core services, and lifecycle tools. Application code should stop at the public facade instead of importing private host internals.

If a crate owns a wire format or manifest type, treat it as compatibility-sensitive. If it owns a provider implementation, treat it as deployment-sensitive. If it owns business registration facades, treat it as application-facing.

## Limitations

- This map explains ownership boundaries; use the [crate catalog](/crates/)
  for APIs, limits, maturity, and registry links.
- Crate names can expose experimental or certification tooling that is not part of the stable application surface.
- Internal modules may change even when public manifest and application contracts remain compatible.
