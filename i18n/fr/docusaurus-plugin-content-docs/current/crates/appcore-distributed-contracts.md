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

`OpaqueEnvelopeDeduplicator` conserve une allocation partagée par ID de message
accepté entre les index d'appartenance et d'ordre FIFO. Le résultat duplicate,
l'éviction et l'API publique ne changent pas. La rétention de 65 536 IDs
distincts de 128 octets sur Apple M1 a réduit le p50 de 37,55 ms à 32,83 ms et
le RSS de pic de 35,86 Mio à 27,25 Mio.

**Maturité :** contrat wire V1 stable à compatibilité stricte.

## Frames chunked Peer RPC V2

Le module post-1.0 `peer_rpc::v2` définit une famille explicite de frames
open/chunk/commit/cancel. Open lie bytes décodés agrégés, taille/nombre de
chunks et deadline; chaque chunk lie séquence, taille décodée exacte et digest;
commit lie le digest du payload décodé complet. Les octets encodés utilisent
une chaîne JSON base64 canonique, pas un tableau d'entiers. V1 et V2 restent
dans des modules et routes séparés, sans détection, conversion ni fallback.

La représentation binaire opt-in encadre les mêmes DTO V2 avec le marqueur fixe
`APCRPC2B`, la version codec, le type frame/reply et la taille Postcard exacte.
Les octets de chunk restent natifs et tout encodage/décodage est borné à
256 Kio. Les fixtures JSON ne changent pas. Un mismatch de marqueur, version,
type, taille ou codec échoue avant dispatch et ne sélectionne jamais une autre
représentation.

:::warning Contrat alpha publié
Les DTO, codec, registre borné et intégration host/client signée V2 ont réussi
la certification release clean-source à `8d26cc3` et sont publiés en
`2.0.0-alpha.1`. Les applications stables continuent avec les routes V1
explicites ; l'alpha reste une prerelease opt-in.
:::

## Erreurs typées Peer RPC V2

`PeerRpcWireErrorV2` ajoute `code`, `phase`, `retryable`, des
`retry_after_ms`/`correlation_id` bornés et un message expurgé contrôlé par le
protocole à la famille V2 explicite. Les métadonnées connues sont validées comme
une matrice unique. Un code inconnu devient `unknown` terminal sans conserver
texte ou retry hint distant. `PeerRpcRemoteErrorV1` est un décodeur exact séparé
du champ string V1 stable; il ne négocie ni ne crée de trafic V2.
