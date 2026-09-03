---
title: appcore-capabilities
sidebar_position: 16
---

# appcore-capabilities

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-capabilities/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-capabilities/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-capabilities)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

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

The default resolver scans borrowed peer and descriptor references, retains
only the first compatible fallback and clones only the selected provider. Its
compatibility check uses the descriptor that already matched instead of
rescanning a copied list of every advertised name. A custom
`CapabilitySelectionPolicy` continues
to receive the complete owned candidate slice required by the stable public
trait.

Call `CapabilityResolver::handle_owned` when the request no longer needs to be
retained by its caller. Policy and local-handler behavior remain borrowed, but
the Peer RPC adapter transfers the request ID, capability, payload,
idempotency key and trace directly into its outbound DTO. Existing borrowed
callers and custom invokers remain compatible.

Default `handle`, `handle_local` and `handle_owned` execution borrows the
selected registry provider or discovery record through enforcement and
dispatch. This avoids cloning a peer's identity, endpoints, capabilities and
metadata for a transient call. `resolve()` retains its owned result, and custom
selectors retain their complete owned candidate contract.

**Maturity:** stable routing profile.
