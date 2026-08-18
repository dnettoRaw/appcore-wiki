---
title: appcore-contracts
sidebar_position: 1
---

# appcore-contracts

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-contracts/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-contracts/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-contracts)
:::


**Responsibility:** stable, implementation-independent Runtime manifests and
policies.

**Direct AppCore dependencies:** None.

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
