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
8. [Updates](/architecture/updates)
9. [Security model](/security/security-model)
10. [Build the first application](/tutorials/first-application)
11. [Examples from basic to intermediate](/tutorials/examples/)
12. [Reference for all 22 public crates](/crates/)
13. [Future roadmap](/roadmap/)

Stable release: `1.0.0`. All 22 public crates are available on crates.io.
Minimum Rust toolchain: `1.89`. Applications should normally depend on
`appcore-bin@1.0.0` and use its `application` facade.

## What's Next

The future roadmap tracks planned work without mixing it into the stable
Runtime reference. The current design previews are [appcore-ai](/crates/appcore-ai)
and [appcore-ui](/crates/appcore-ui). High-priority planned areas include
`appcore-test`, `appcore-jobs`, `appcore-search`, `appcore-automation` and
`appcore-plugin`; see the [Future Roadmap](/roadmap/).

## Limitations

This index is a reading map, not an API reference. Use the chapter pages for operational behavior, trade-offs, and unsupported cases.
