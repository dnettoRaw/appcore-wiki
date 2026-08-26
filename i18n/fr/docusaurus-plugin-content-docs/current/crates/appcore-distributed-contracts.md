---
title: appcore-distributed-contracts
sidebar_position: 6
---

# appcore-distributed-contracts

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-distributed-contracts/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-distributed-contracts/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-distributed-contracts)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

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

## Frames chunked Peer RPC V2

Le module post-1.0 `peer_rpc::v2` définit une famille explicite de frames
open/chunk/commit/cancel. Open lie bytes décodés agrégés, taille/nombre de
chunks et deadline; chaque chunk lie séquence, taille décodée exacte et digest;
commit lie le digest du payload décodé complet. Les octets encodés utilisent
une chaîne JSON base64 canonique, pas un tableau d'entiers. V1 et V2 restent
dans des modules et routes séparés, sans détection, conversion ni fallback.

:::warning Contrat alpha publié
Les DTO, codec, registre borné et intégration host/client signée V2 ont réussi
la certification release clean-source à `8d26cc3` et sont publiés en
`2.0.0-alpha.1`. Les applications stables continuent avec les routes V1
explicites ; l'alpha reste une prerelease opt-in.
:::
