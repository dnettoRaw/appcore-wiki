---
title: appcore-bin
sidebar_position: 22
---

# appcore-bin

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-bin)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

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

On the current 1.0 maintenance line, direct facade, application HTTP and peer
RPC handlers execute without retaining the shared host mutex. Independent
commands progress concurrently; idempotency reservation remains serialized per
store. `shutdown()` closes admission, drains admitted commands for at most 30
seconds and only then completes lifecycle. Embedded tests can select a shorter
bound with `shutdown_with_timeout`.

Selecting `[adapters.gateway]` with provider `appcore-gateway` is the
declarative Gateway activation boundary. Bootstrap parses the configuration
through the owner crate, adds and authorizes `runtime.gateway` in the shared
catalog, reuses Runtime security and registers the service with the Supervisor.
Configuration or bind failure aborts startup; omission creates no Gateway
listener or task. `ApplicationServiceReport` exposes safe started, state and
bind fields. The host supplies a process-safe replay store; cluster requires
absolute `paths.gateway_replay` on a shared writable volume. Shutdown force-closes
incomplete connections before joining all Gateway-owned work.

This is the recommended dependency for new applications. The crate owns
manifest loading, provider composition, lifecycle, HTTP, sync, peer RPC,
control plane, Gateway, scheduling, supervision, updates and shutdown.

Application code must use the public `application` module and avoid private host
internals.

## Experimental source-only AI integration

The current Runtime development workspace contains an opt-in `ai-alpha`
feature that is **not part of the published `appcore-bin 1.0.0` artifact**. It
attaches an already configured `appcore_ai::AiRuntime` through
`AppCoreAiComponent` and `ManifestApplicationHost::with_ai`. The existing
Supervisor owns required/optional health, cancellation and bounded shutdown.

This programmatic bridge does not alter V1 manifests. It belongs to the
independent [`appcore-ai 0.1.0-beta.1`](./appcore-ai) beta release;
declarative model/provider selection requires a future versioned post-1.0
contract and a publishable AppCore release.

**Maturity:** stable manifest-first facade; composition internals remain
implementation details.
