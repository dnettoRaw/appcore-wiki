---
title: appcore-api
sidebar_position: 8
---

# appcore-api

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-api/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-api/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-api)
:::


**Responsabilité :** host HTTP command/query/status et DTOs de transport.

**Dépendances AppCore directes :** `appcore-core`, `appcore-security`, `appcore-supervisor`.

**API principale :** `CommandRequest`/`CommandResponse`,
`QueryRequest`/`QueryResponse`, erreurs de validation, `CommandEndpoint`,
`QueryEndpoint`, `ApiRouter`, `ApiRequest`/`ApiResponse`, `RuntimeHttpHost`,
`HttpApiConfig`, statut statique, policy capability, vérification token et vue
du sync log.

À utiliser pour les routes Runtime et queries applicatives enregistrées. Ne pas
ajouter resources REST produit ou schémas métier. Le nouveau host l'utilise via
`appcore-bin`.

La limite configurée s'applique au corps HTTP complet avant la
désérialisation JSON par Axum. Les routes protégées acceptent exactement un
header bearer `Authorization` bien formé; les doublons échouent fermés.

**Maturité :** surface HTTP V1 RC stricte et stable.
