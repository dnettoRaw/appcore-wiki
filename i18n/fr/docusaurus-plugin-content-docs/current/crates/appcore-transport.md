---
title: appcore-transport
sidebar_position: 4
---

# appcore-transport

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-transport)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-transport/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-transport/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-transport/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** mécanique client HTTP/TLS partagée et bornée.

**Dépendances internes :** aucune.

**Versionnement :** SemVer indépendant. Le crate peut être utilisé sans aucun
autre paquet AppCore.

**API principale :** `HttpScheme`, `HttpTarget`, `HttpRequest`, `HttpHeader`,
`HttpClient`, `HttpExchangeConfig`, `HttpTimeouts`, `HttpPoolConfig`,
`HttpClientConfig`, `HttpResponse`, `CancellationToken`, `TransportError`,
`send`, parsing de réponse et gzip borné.

Conservez et clonez un `HttpClient` pour partager un pool borné par schéma,
hôte et port. Les délais de connexion/admission, de lecture et d'écriture sont
indépendants. Seules les réponses entièrement cadrées et analysées sont
réutilisables ; troncature, cadrage invalide, timeout, annulation,
`Connection: close` et corps délimité par fermeture éliminent le socket. La
fonction libre `send` reste un adaptateur V1 one-shot et continue d'envoyer
`Connection: close`.

À utiliser dans les adapters partageant limites, timeout, annulation et TLS. Le
consommateur garde authentification et policy. Ne pas en faire un framework web
ni ajouter d'endpoints métier.

Le `Debug` request/response expose la taille du body, jamais ses bytes. Les
headers de credential connus sont masques meme si l'appelant utilise le
constructeur non sensible.

**Maturité :** surface infrastructure stable.
