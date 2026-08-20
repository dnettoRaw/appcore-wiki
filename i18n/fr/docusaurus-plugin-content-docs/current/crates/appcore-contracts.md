---
title: appcore-contracts
sidebar_position: 2
---

# appcore-contracts

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-contracts/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-contracts/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-contracts)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** manifests et policies Runtime stables, indépendants des
implémentations.

**Dépendances internes :** aucune.

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
