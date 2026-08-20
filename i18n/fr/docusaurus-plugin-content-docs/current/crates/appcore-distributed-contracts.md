---
title: appcore-distributed-contracts
sidebar_position: 6
---

# appcore-distributed-contracts

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-distributed-contracts/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-distributed-contracts/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-distributed-contracts)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-distributed-contracts/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-distributed-contracts/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-distributed-contracts/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** contrats wire/provider versionnés control plane et peer
RPC.

**Dépendances internes :** `appcore-contracts`, `appcore-types`.

**API principale :** constantes et paths protocole, registration, presence,
heartbeat, peer directory, leases de compatibilité, leases par service,
leadership decisions et traits; paths peer, enveloppes, réponses, erreurs, call
kinds, advertisement DTOs, client executor et métadonnées de transport pour
content-envelope opaque.

Les implémentations appartiennent aux crates control plane ou peer. Ne pas
ajouter client HTTP, filesystem, tokens ou règles capability produit.

La serialisation wire opaque-content et Peer RPC reste inchangee. Le `Debug`
expose tailles et metadonnees de routage, sans bytes du payload opaque, valeurs
nonce/idempotence ou details d'erreur distante.

**Maturité :** contrat wire V1 stable à compatibilité stricte.
