---
title: appcore-capabilities
sidebar_position: 16
---

# appcore-capabilities

:::info Published package
Published **`1.0.1-rc.8`** · current Runtime workspace **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-capabilities/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-capabilities/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-capabilities)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-capabilities/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-capabilities/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-capabilities/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** catalog composed capability descriptors, register local
handlers and resolve compatible local or remote providers.

**Internal dependencies:** contracts, core and distributed contracts.

**Primary API:** descriptor catalog and enforcement context, capability
request/response/error, local handler and remote invoker traits, local provider,
registry, provider selection, resolution policy and selection trait, default
deterministic selection, resolver and contract-backed peer RPC remote invoker.

Use generic capability IDs and explicit requirements. The resolver may consider
health, mode, leadership and policy; it must not interpret product semantics.

Use `CapabilityCatalog` when a composition root needs to resolve and authorize
manifest descriptors before dispatch. Use `CapabilityRegistry` only when a real
local handler is available. Catalog and resolver share request, write-mode and
leadership enforcement, so a host does not need to rescan manifests locally.

**Maturity:** stable RC routing profile.
