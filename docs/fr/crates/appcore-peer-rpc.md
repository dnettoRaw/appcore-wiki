---
title: appcore-peer-rpc
sidebar_position: 16
---

# appcore-peer-rpc

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-peer-rpc/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-peer-rpc/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-peer-rpc)
:::


**Responsabilité :** client peer authentifié, host HTTP, validation et replay
protection.

**Dépendances AppCore directes :** `appcore-core`, `appcore-distributed-contracts`, `appcore-security`, `appcore-transport`.

**API principale :** traits token issuer/authenticator/dispatcher et
implémentations HashToken/static; nonce stores mémoire/fichier; config,
validator et hashes; retry/client config et trait transport; transport standard;
HTTP state et host.

À utiliser uniquement si tenant, cluster, source, cible, protocole, expiry,
nonce et intégrité sont établis. `AllowPeerAuthenticator` est réservé aux tests.

Le `Debug` des DTO peer request, response, outbound et HTTP expose les tailles
et omet bytes opaques, credentials, valeurs nonce/idempotence et details
d'erreur distante.

**Maturité :** surface peer V1 RC stable.
