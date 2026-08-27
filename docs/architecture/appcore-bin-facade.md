---
title: appcore-bin Facade Ownership
sidebar_position: 13
---

# appcore-bin Facade Ownership

AC-023 evaluated whether the manifest-first application facade should move to
a light SDK crate while `appcore-bin` remained the Runtime host.

## Decision

`appcore-bin` remains both the public manifest-first facade and the only
composition root for the current 1.x contract. No `appcore-sdk` or
`appcore-runtime` crate is introduced.

Applications continue to implement `appcore_bin::application::Application` and
call `appcore_bin::application::run_application`. This keeps one owner for
manifest loading, providers, listeners, lifecycle, supervision and shutdown,
and preserves the [three-artifact contract](./three-artifact-contract).

## Evidence

A clean optimized build of the maintained three-artifact consumer at Runtime
commit `a33a934` used Rust 1.97.1 on macOS arm64. Its normal graph contained 22
AppCore packages and 196 packages total. The build took 170.46 seconds, reached
693,846,016 bytes maximum RSS, produced a 10,242,592-byte application binary
and used 481,808 KiB in the fresh Cargo target directory.

This is real compile-time cost, but splitting facade traits does not remove the
host graph from an executable: `run_application` must still reach the concrete
composition root. A split would therefore add a crate or change the frozen
public path without demonstrating an artifact benefit.

## Reconsideration

The decision can be reconsidered in a later 1.x milestone only with concrete
library-only consumers, one acyclic composition owner, packaged-consumer and
SemVer evidence, and at least a 20% measured clean-build or graph reduction.
No compatibility alias, implicit migration or second composition path is
allowed.
