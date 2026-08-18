---
title: Examples — Basic to Intermediate
sidebar_position: 0
slug: /en/tutorials/examples/
---

# Examples — Basic to Intermediate

This path grows one external application without changing the AppCore boundary.
Every stage keeps the three owned artifacts: Application Manifest, Deployment
Manifest, and business code. Runtime infrastructure remains inside
`appcore-bin`.

| Level | Build | Main lesson |
| --- | --- | --- |
| 1 — Basic | [Standalone ping](./standalone-ping) | Install from crates.io, declare one command, and boot safely |
| 2 — Basic+ | [Command, event, and query](./command-event-query) | Enforce the manifest, emit a fact, add a side-effect-free read, and test both paths |
| 3 — Intermediate | [Scheduled task](./scheduled-task) | Register bounded application work while the Runtime owns workers and shutdown |
| 4 — Intermediate | [Standalone to cluster](./standalone-to-cluster) | Keep business code unchanged and switch infrastructure through deployment |

## Before starting

- Install Rust `1.89` or newer.
- Use AppCore `1.0.1-rc.8`.
- Keep secrets outside manifests.
- Run each example from its project root.

The examples use the public `appcore_bin::application` facade. They do not copy
the low-level `RuntimeBuilder`, hand-build an HTTP listener, or instantiate
storage/security providers in application code.

## What these examples do not claim

The local file provider, loopback HTTP, and file-backed cluster coordination
are learning and conformance profiles. A production deployment still owns TLS,
secret storage, filesystem guarantees, backups, capacity, and operated
provider evidence.
