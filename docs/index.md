---
title: AppCore Runtime
sidebar_position: 1
---

# AppCore Runtime

AppCore is a Rust runtime for applications whose infrastructure must be explicit: manifests, lifecycle, command dispatch, storage boundaries, synchronization, provider selection, peer communication, supervision, and update activation are runtime responsibilities rather than application boilerplate.

This manual is written as a technical book. Read the chapters in order if you are new to the project:

1. [What AppCore is](/introduction/what-is-appcore)
2. [The three-artifact contract](/architecture/three-artifact-contract)
3. [Bootstrap and runtime host](/architecture/bootstrap)
4. [Storage, DNT, backup, and restore](/architecture/storage)
5. [Synchronization, logs, checkpoints, and replay](/architecture/synchronization)
6. [Distributed operation](/architecture/distributed)
7. [Supervisor and lifecycle](/architecture/supervisor)
8. [Performance budgets](/architecture/performance-budgets)
9. [Updates](/architecture/updates)
10. [Security model](/security/security-model)
11. [Build the first application](/tutorials/first-application)
12. [Examples from basic to intermediate](/tutorials/examples/)
13. [Reference for the stable crates and published previews](/crates/)
14. [Future roadmap](/roadmap/)

Stable release: `1.0.0`. All 22 public crates are available on crates.io.
Minimum Rust toolchain: `1.89`. Applications should normally depend on
`appcore-bin@1.0.0` and use its `application` facade.

Published prereleases: `appcore-ai 0.1.0-beta.3`, the Runtime graph at
`2.0.0-alpha.1`, `appcore-transport 1.1.0-alpha.1`, and the optional
`appcore-sync-sqlite 0.1.0-alpha.2` integration. None changes the frozen V1
manifest contract.

## What's Next

The future roadmap tracks planned work without mixing it into the stable
Runtime reference. The current published previews are
[appcore-ai](/crates/appcore-ai) and
[appcore-sync-sqlite](/crates/appcore-sync-sqlite); the current design preview
is [appcore-ui](/crates/appcore-ui).
High-priority planned areas include
`appcore-test`, `appcore-jobs`, `appcore-search`, `appcore-automation` and
`appcore-plugin`; see the [Future Roadmap](/roadmap/).

## Limitations

This index is a reading map, not an API reference. Use the chapter pages for operational behavior, trade-offs, and unsupported cases.
