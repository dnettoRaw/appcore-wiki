---
title: appcore-transport
sidebar_position: 3
---

# appcore-transport

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-transport)
:::


**Responsabilité :** mécanique client HTTP/TLS partagée et bornée.

**Dépendances AppCore directes :** Aucune.

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
