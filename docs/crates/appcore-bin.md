---
title: appcore-bin (retired)
sidebar_position: 22
---

# appcore-bin is retired

:::danger Do not use for new applications
`appcore-bin` has been removed from the Runtime workspace. Its final crates.io
package, [`1.0.1`](https://crates.io/crates/appcore-bin/1.0.1), is a
dependency-free retirement notice and provides no executable, host, CLI,
compatibility layer, or Runtime behavior. Every earlier functional version is
yanked.
:::

Use [`appcore-sdk 1.0.0-rc.1`](https://crates.io/crates/appcore-sdk/1.0.0-rc.1)
for application contracts, canonical manifests, registration, logging, and
opt-in capability namespaces.

Existing applications keep `application.toml`, `deployment.toml`, and their
business code. Replace `appcore_bin` imports with `appcore_sdk`; the deployment
executable remains responsible for providers, listeners, workers, signals, and
shutdown.

Historical `appcore-bin` releases remain registry evidence only. They are not
the current AppCore application API.
