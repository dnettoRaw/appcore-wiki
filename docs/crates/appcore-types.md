---
title: appcore-types
sidebar_position: 3
---

# appcore-types

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-types/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-types/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-types)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** validated foundational identifiers, identity and trace
types shared across Runtime contracts.

**Internal dependencies:** `appcore-contracts`.

**Primary API:** application, node, tenant, cluster, Core, instance, command,
event, query, state and capability IDs; `RuntimeIdentity`, `CoreIdentity`,
version policies/status, `TraceContext`, `RuntimeError`,
`RuntimeResult`.

Use these types instead of passing unchecked strings across boundaries. Do not
place implementation state, I/O or provider behavior here.

**Maturity:** stable foundational surface.
