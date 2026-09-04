---
title: SDK facade ownership
sidebar_position: 13
---

# SDK facade ownership

The earlier AC-023 decision to keep application and host ownership together in
`appcore-bin` has been superseded.

## Current decision

`appcore-sdk` owns the public application facade, canonical local manifests,
registration bridge, bounded logging, and opt-in capability namespaces.
`appcore-bin` is retired and removed from the Runtime workspace.

The SDK does not own an implicit Runtime host or CLI. Deployment executables
own provider composition, listeners, workers, signals, and shutdown. This
keeps application business code within the
[three-artifact contract](./three-artifact-contract) without making the SDK a
process composition root.

No compatibility alias or second parser preserves `appcore_bin`. Existing
applications migrate directly to [`appcore-sdk`](/crates/appcore-sdk).
