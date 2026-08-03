---
title: Crate Map
sidebar_position: 12
---

# Crate Map

AppCore crates are split by ownership boundary, not by convenience.

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

