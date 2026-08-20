---
title: appcore-transport
sidebar_position: 4
---

# appcore-transport

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-transport)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-transport/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-transport/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-transport/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** mécanique client HTTP/TLS partagée et bornée.

**Dépendances internes :** aucune.

**Versionnement :** SemVer indépendant. Le crate peut être utilisé sans aucun
autre paquet AppCore.

**API principale :** `HttpScheme`, `HttpTarget`, `HttpRequest`, `HttpHeader`,
`HttpClientConfig`, `HttpResponse`, `CancellationToken`, `TransportError`,
`send`, parsing de réponse et gzip borné.

À utiliser dans les adapters partageant limites, timeout, annulation et TLS. Le
consommateur garde authentification et policy. Ne pas en faire un framework web
ni ajouter d'endpoints métier.

Le `Debug` request/response expose la taille du body, jamais ses bytes. Les
headers de credential connus sont masques meme si l'appelant utilise le
constructeur non sensible.

**Maturité :** surface infrastructure RC stable.
