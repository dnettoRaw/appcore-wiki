---
title: appcore-peer-rpc
sidebar_position: 17
---

# appcore-peer-rpc

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-peer-rpc/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-peer-rpc/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-peer-rpc)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** client peer authentifié, host HTTP, validation et replay
protection.

**Dépendances internes :** core, distributed contracts, security et transport.

**API principale :** traits token issuer/authenticator/dispatcher et
implémentations HashToken/static; nonce stores mémoire/fichier; config,
validator et hashes ; retry/client config et trait transport ; transports
pooled et standard one-shot ; HTTP state et host.

Utilisez `PooledPeerRpcTransport` pour réutiliser des connexions bornées par
origine. `StdPeerRpcTransport` conserve le comportement V1 one-shot avec
`Connection: close`.

À utiliser uniquement si tenant, cluster, source, cible, protocole, expiry,
nonce et intégrité sont établis. `AllowPeerAuthenticator` est réservé aux tests.

Le `Debug` des DTO peer request, response, outbound et HTTP expose les tailles
et omet bytes opaques, credentials, valeurs nonce/idempotence et details
d'erreur distante.

**Maturité :** surface peer V1 stable.

## Codec V2 borné

`PeerRpcChunkEncoder` et `PeerRpcChunkAssembler` traitent un stream V2
explicitement sélectionné un chunk borné à la fois. Les limites par défaut sont
64 KiB décodés par chunk, 96 KiB encodés, 64 MiB agrégés et 1 024 chunks.
Séquence, taille décodée exacte, SHA-256 par chunk et total, deadline,
annulation et quota après gzip échouent de manière fermée. Un commit échoué
n'expose jamais le sink partiel comme complet.

`PeerRpcStreamRegistry` possède les sessions partielles sous des quotas exacts
de sessions et d'octets décodés. Les chunks de requête utilisent des fichiers
exclusifs dans un répertoire de spool existant réservé au propriétaire; seuls
les commits vérifiés atteignent le dispatcher et les réponses utilisent des
pulls explicites et bornés. Erreur, annulation, expiration et fin libèrent le
fichier et la réservation. Le snapshot expose sessions, octets réservés,
saturations et nettoyages.

Cette API ne négocie pas le transport. `/v1/peer/*` analyse uniquement V1 et
n'infère jamais V2. Le transport HTTP signé des frames et l'intégration client
restent des gates AC-006.
