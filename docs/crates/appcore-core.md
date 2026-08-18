---
title: appcore-core
sidebar_position: 7
---

# appcore-core

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-core/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-core/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-core)
:::


**Responsibility:** generic in-process Runtime lifecycle, registration,
dispatch, state, audit and idempotency.

**Direct AppCore dependencies:** `appcore-contracts`, `appcore-types`.

**Primary API:** `RuntimeBuilder`, `RuntimeController`, `RuntimeInstance`,
`RuntimeLifecycle`, command/event registries and buses, envelopes,
`CommandHandler`, `CommandResult`, `RuntimeContext`, audit log and journal,
in-memory/file idempotency, state and decision registries/engines, clock,
redaction and compatibility `AppPlugin`.

New applications consume these re-exports through
`appcore_bin::application`; they do not assemble the core manually. Keep I/O
adapters and domain behavior outside this crate.

**Maturity:** stable low-level RC surface; builder/plugin APIs are compatibility
level, while manifest-first hosting is preferred.
