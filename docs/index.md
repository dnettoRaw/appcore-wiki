---
title: AppCore Runtime
sidebar_position: 0
slug: /
---

# AppCore Runtime

AppCore is a Rust runtime for applications whose infrastructure must be explicit: manifests, lifecycle, command dispatch, storage boundaries, synchronization, provider selection, peer communication, supervision, and update activation are runtime responsibilities rather than application boilerplate.

This manual is written as a technical book. Read the chapters in order if you are new to the project:

1. [What AppCore is](/en/introduction/what-is-appcore)
2. [The three-artifact contract](/en/architecture/three-artifact-contract)
3. [Bootstrap and runtime host](/en/architecture/bootstrap)
4. [Storage, DNT, backup, and restore](/en/architecture/storage)
5. [Synchronization, logs, checkpoints, and replay](/en/architecture/synchronization)
6. [Distributed operation](/en/architecture/distributed)
7. [Supervisor and lifecycle](/en/architecture/supervisor)
8. [Updates](/en/architecture/updates)
9. [Security model](/en/security/security-model)
10. [Build the first application](/en/tutorials/first-application)

Current runtime line: `1.0.1-rc.8`. Minimum Rust toolchain: `1.89`.

Other languages:

- [Português](/pt/)
- [Français](/fr/)

## Limitations

This root page is a language and reading entry point. It does not replace the technical chapters.
