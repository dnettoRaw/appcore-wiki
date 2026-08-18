---
title: appcore-types
sidebar_position: 2
---

# appcore-types

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-types/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-types/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-types)
:::


**Responsibility:** validated foundational identifiers, identity and trace
types shared across Runtime contracts.

**Direct AppCore dependencies:** `appcore-contracts`.

**Primary API:** application, node, tenant, cluster, Core, instance, command,
event, query, state and capability IDs; `RuntimeIdentity`, `CoreIdentity`,
version policies/status, `TraceContext`, `RuntimeError`,
`RuntimeResult`.

Use these types instead of passing unchecked strings across boundaries. Do not
place implementation state, I/O or provider behavior here.

**Maturity:** stable foundational RC surface.
