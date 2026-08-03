---
title: Crate Map
sidebar_position: 12
---

# Crate Map

When a runtime grows, crate boundaries either explain the architecture or hide it. AppCore crates are split by ownership boundary, not by convenience.

| Layer | Crates | Why it exists |
| --- | --- | --- |
| Foundation | `appcore-contracts`, `appcore-types`, `appcore-transport`, `appcore-dnt` | reusable contracts, validated IDs, bounded transport, and encrypted file envelopes without concrete runtime composition |
| Lifecycle | `appcore-supervisor` | service graph, restart policy, watchdog, and quarantine independent from command dispatch |
| Core | `appcore-core` | command/event/state/decision registries, runtime identity, lifecycle, audit, idempotency |
| Runtime services | `appcore-api`, `appcore-storage`, `appcore-security`, `appcore-ops`, `appcore-scheduler`, `appcore-sync` | one infrastructure responsibility per crate |
| Distributed | `appcore-distributed-contracts`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-gateway` | wire contracts, presence, discovery, leases, capability routing, peer transport, and gateway relay |
| Composition | `appcore-provider`, `appcore-update`, provider adapters | provider factories, deployment plans, coordination stores, update lifecycle |
| Host | `appcore-bin` | the only crate allowed to compose concrete runtime infrastructure for applications |
| Tools | `runtime-console`, certification tools | operator and release evidence workflows |

The architecture rule is acyclic dependency direction. Contracts do not depend on implementations. Business code depends on the public application facade, not private host modules.

## How should you read this map?

Start from the host and move downward. `appcore-bin` composes concrete runtime infrastructure. It depends on contracts, providers, core services, and lifecycle tools. Application code should stop at the public facade instead of importing private host internals.

If a crate owns a wire format or manifest type, treat it as compatibility-sensitive. If it owns a provider implementation, treat it as deployment-sensitive. If it owns business registration facades, treat it as application-facing.

## Limitations

- This map explains ownership boundaries; it is not an exhaustive API reference.
- Crate names can expose experimental or certification tooling that is not part of the stable application surface.
- Internal modules may change even when public manifest and application contracts remain compatible.
