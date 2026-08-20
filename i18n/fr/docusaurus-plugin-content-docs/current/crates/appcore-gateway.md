---
title: appcore-gateway
sidebar_position: 18
---

# appcore-gateway

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-gateway/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-gateway/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-gateway)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-gateway/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-gateway/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-gateway/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** relay WebSocket isolé par tenant pour les connexions
Gateway entre clients externes et workers AppCore.

**Dépendances internes :** contracts, types, security, distributed
contracts et peer RPC.

**API principale :** `GatewayConfig`, `GatewayState`, état par tenant, registry
et resolver de capability, connexions worker/client bornées,
`MeshPeerTransport`, DTOs request/response du mesh relay, pruner heartbeat et
factory du router Axum. Les contrats content-envelope opaque sont réexportés
pour router des payloads chiffrés.

Le gateway résout le tenant depuis le suffixe de domaine défini par le
deployment ou depuis un paramètre de query réservé aux tests locaux, authentifie
les connexions lorsque configuré, route les enveloppes Peer RPC et les requests
HTTP Peer RPC via mesh relay uniquement dans la partition du tenant et retire
les workers stale avec des files de sortie bornées.

Les upgrades authentifies acceptent les credentials uniquement dans le header
`Authorization` ; les credentials en query sont rejetes. Les tokens worker
utilisent `worker_connection_hash` pour lier tenant, cluster, installation,
Core et capabilities. Les tokens client utilisent `client_connection_hash`
pour lier tenant, cluster et device. Ce sont des tokens `peer` a usage unique,
avec `jti`, request hash et une duree maximale de 60 secondes ; le socket expire
avec le token.

Le mesh relay valide le schema V1, les metadonnees de routage Peer RPC internes,
le digest du body et le hash signe avant forwarding. Le payload applicatif
reste opaque. Frames et messages sont limites a 4 Mio ; les limites tenant,
connexion, capability, request en attente, timeout, queue et routage concurrent
echouent fermees. Le heartbeat exige le JSON exact et une reponse worker n'est
acceptee que depuis la generation de connexion selectionnee.

`mesh-relay` est un peer transport pour les Cores qui gardent des connexions
Gateway sortantes au lieu d'exposer des ports locaux ou IPs stables. Ce n'est
pas un systeme de consensus, un terminateur TLS public ni un gestionnaire de
secrets de production. HA du gateway, federation edge relay et transports
alternatifs restent futurs et ne doivent pas affaiblir l'authentification,
expiry, nonce ou replay protection de Peer RPC.

L'etat replay/session reste local au processus. Un etat partage de
revocation/session pour Gateway multi-instance reste un futur provider. Le rate
limit par IP source et la terminaison TLS restent au deployment.
`GatewayConfig::new` active l'authentification. La seule désactivation est
`insecure_local_for_testing()`, qui refuse les listeners hors loopback, et
`GatewayState::new` valide la configuration avant de construire l'état.

Les hashes de connexion worker et client utilisent un framing binaire
canonique V2 avec le marqueur `v2:`. Les anciens hashes sans version ne sont
pas interchangeables; émetteurs de token et consommateurs Gateway doivent être
mis à jour ensemble.

**Maturité :** profil RC de peer transport pour la surface distribuee V1.
