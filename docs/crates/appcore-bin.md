---
title: appcore-bin
sidebar_position: 22
---

# appcore-bin

:::info Published package
Published **`1.0.1-rc.8`** · current Runtime workspace **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-bin)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** manifest-first application facade, Runtime CLI and
composition root.

**Internal dependencies:** all Runtime service/composition crates.

**Primary application API:** `Application`, `run_application`,
`ManifestApplicationHost`, `ApplicationServiceReport`, `DeploymentContext`,
resolved volume/environment values and `ApplicationTaskRegistry`.

**Host API:** typed bootstrap/configuration errors and results, CLI parsing and
commands, local paths/lifecycle, server entry points, build information and
optional auth-server grant tooling.

Both binaries parse bounded UTF-8 input through `appcore-args`. Generated help,
validation and dynamic Bash, Zsh, Fish and PowerShell completion share one
declarative command specification; command execution remains in this crate.

The final distributed manifest feeds one `appcore-capabilities` catalog during
bootstrap. Direct facade, application HTTP and peer RPC dispatch use that same
owner for declaration, mode, idempotency, operational-write and leadership
enforcement. Runtime-owned status queries remain explicit host behavior.

This is the recommended dependency for new applications. The crate owns
manifest loading, provider composition, lifecycle, HTTP, sync, peer RPC,
control plane, scheduling, supervision, updates and shutdown.

Application code must use the public `application` module and avoid private host
internals.

**Maturity:** stable manifest-first RC facade; composition internals remain
implementation details.
