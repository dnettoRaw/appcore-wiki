---
title: appcore-contracts
sidebar_position: 2
---

# appcore-contracts

:::info Published package
Published **`1.0.1-rc.8`** · current Runtime workspace **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-contracts/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-contracts/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-contracts)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** stable, implementation-independent Runtime manifests and
policies.

**Internal dependencies:** none.

**Primary API:** `ApplicationManifestV1`, `DeploymentManifestV1`,
`DeploymentManifestBuilder`, `RuntimeManifestV1`, `RuntimeMode`,
`RuntimeOperationalMode`, capability/storage/leadership/job/scheduler/health/
update/module policies, provider/network/TLS/volume/environment configuration,
`ContractError`.

Use it to parse, build and validate portable contracts. Keep serialized names
and meanings stable. Do not add transport, filesystem, process or business
implementation code.

**Maturity:** stable RC contract surface. V1 changes must be additive and
compatible for the 1.0 line.
