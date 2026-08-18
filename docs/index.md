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
12. [Reference for all 21 published crates](/crates/)

Current runtime line: `1.0.1-rc.8`. Minimum Rust toolchain: `1.89`. All 21
Runtime crates are published; applications should normally depend on
`appcore-bin` and use its `application` facade.

## Limitations

This index is a reading map, not an API reference. Use the chapter pages for operational behavior, trade-offs, and unsupported cases.
