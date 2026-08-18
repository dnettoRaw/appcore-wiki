---
title: appcore-contracts
sidebar_position: 1
---

# appcore-contracts

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-contracts/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-contracts/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-contracts)
:::


**Responsabilité :** manifests et policies Runtime stables, indépendants des
implémentations.

**Dépendances AppCore directes :** Aucune.

**API principale :** `ApplicationManifestV1`, `DeploymentManifestV1`,
`DeploymentManifestBuilder`, `RuntimeManifestV1`, `RuntimeMode`,
`RuntimeOperationalMode`, policies capability/storage/leadership/job/scheduler/
health/update/module, configuration provider/network/TLS/volume/environment et
`ContractError`.

À utiliser pour parser, construire et valider les contrats portables. Préserver
noms sérialisés et sens. Ne pas ajouter transport, filesystem, processus ou
métier.

**Maturité :** surface RC stable. Les changements V1 restent additifs et
compatibles sur la ligne 1.0.
