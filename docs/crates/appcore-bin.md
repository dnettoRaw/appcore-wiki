---
title: appcore-bin
sidebar_position: 21
---

# appcore-bin

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-bin)
:::


**Responsibility:** manifest-first application facade, Runtime CLI and
composition root.

**Direct AppCore dependencies:** `appcore-api`, `appcore-capabilities`, `appcore-contracts`, `appcore-control-plane`, `appcore-core`, `appcore-ops`, `appcore-peer-rpc`, `appcore-provider`, `appcore-provider-vercel-neon`, `appcore-scheduler`, `appcore-security`, `appcore-storage`, `appcore-supervisor`, `appcore-sync`, `appcore-update`.

**Primary application API:** `Application`, `run_application`,
`ManifestApplicationHost`, `ApplicationServiceReport`, `DeploymentContext`,
resolved volume/environment values and `ApplicationTaskRegistry`.

**Host API:** typed bootstrap/configuration errors and results, CLI parsing and
commands, local paths/lifecycle, server entry points, build information and
optional auth-server grant tooling.

This is the recommended dependency for new applications. The crate owns
manifest loading, provider composition, lifecycle, HTTP, sync, peer RPC,
control plane, scheduling, supervision, updates and shutdown.

Application code must use the public `application` module and avoid private host
internals.

**Maturity:** stable manifest-first RC facade; composition internals remain
implementation details.
