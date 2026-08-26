---
title: appcore-core
sidebar_position: 8
---

# appcore-core

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-core/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-core/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-core)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** generic in-process Runtime lifecycle, registration,
dispatch, state, audit and idempotency.

**Internal dependencies:** `appcore-contracts`, `appcore-types`.

**Primary API:** `RuntimeBuilder`, `RuntimeController`, `RuntimeInstance`,
`RuntimeLifecycle`, command/event registries and buses, envelopes,
`CommandHandler`, `CommandResult`, `RuntimeContext`, audit log and journal,
in-memory/file idempotency, state and decision registries/engines, clock,
redaction and compatibility `AppPlugin`.

On the current 1.0 maintenance line, cloned `RuntimeController` values share
lifecycle, idempotency and in-flight state, while the immutable command bus
owns handlers through `Arc`. Independent handlers execute concurrently; one
idempotency key still admits at most one execution. Shutdown closes admission
atomically before a bounded drain of admitted commands.

New applications consume these re-exports through
`appcore_bin::application`; they do not assemble the core manually. Keep I/O
adapters and domain behavior outside this crate.

**Maturity:** stable low-level surface; builder/plugin APIs are compatibility
level, while manifest-first hosting is preferred.
