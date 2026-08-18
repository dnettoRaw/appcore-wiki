---
title: appcore-capabilities
sidebar_position: 15
---

# appcore-capabilities

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-capabilities/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-capabilities/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-capabilities)
:::


**Responsibility:** register local capability handlers and resolve compatible
local or remote providers.

**Direct AppCore dependencies:** `appcore-contracts`, `appcore-core`, `appcore-distributed-contracts`.

**Primary API:** capability request/response/error, local handler and remote
invoker traits, local provider, registry, provider selection, resolution policy
and selection trait, default deterministic selection, resolver and peer RPC
remote invoker.

Use generic capability IDs and explicit requirements. The resolver may consider
health, mode, leadership and policy; it must not interpret product semantics.

**Maturity:** stable RC routing profile.
