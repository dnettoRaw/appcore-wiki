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

Published application facade: `appcore-bin@1.0.1-rc.8`. Current Runtime
workspace: `1.0.1-rc.9`. Minimum Rust toolchain: `1.89`. Applications should
normally depend on `appcore-bin` and use its `application` facade. The 22nd
public crate, independently versioned `appcore-args`, is published as
`1.0.1-rc.9`.

## Limitations

This index is a reading map, not an API reference. Use the chapter pages for operational behavior, trade-offs, and unsupported cases.
