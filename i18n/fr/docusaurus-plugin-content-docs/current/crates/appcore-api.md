---
title: appcore-api
sidebar_position: 9
---

# appcore-api

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-api/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-api/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-api)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** host HTTP command/query/status et DTOs de transport.

**Dépendances internes :** `appcore-core`, `appcore-security` et
`appcore-supervisor`.

**API principale :** `CommandRequest`/`CommandResponse`,
`QueryRequest`/`QueryResponse`, erreurs de validation, `CommandEndpoint`,
`QueryEndpoint`, `ApiRouter`, `ApiRequest`/`ApiResponse`, `RuntimeHttpHost`,
`HttpApiConfig`, statut statique, policy capability pour commands et queries
applicatives, vérification token et vue du sync log.

À utiliser pour les routes Runtime et queries applicatives enregistrées. Ne pas
ajouter resources REST produit ou schémas métier. Le nouveau host l'utilise via
`appcore-bin`.

Les queries applicatives sont autorisées par la policy capability composée
avant le router. Les queries de statut Runtime restent hors du catalogue
applicatif.

Sur la ligne de maintenance 1.0 actuelle, les hosts Runtime gèlent
l'enregistrement des queries de `ApiRouter` après le bootstrap. Les snapshots
du router partagent des endpoints immuables via `Arc` ; la façade directe, le
HTTP et le peer RPC libèrent le mutex d'état du host avant d'appeler
l'endpoint. Les queries indépendantes s'exécutent donc en parallèle et un
enregistrement tardif échoue avec `router_frozen`.

La limite configurée s'applique au corps HTTP complet avant la
désérialisation JSON par Axum. Les routes protégées acceptent exactement un
header bearer `Authorization` bien formé; les doublons échouent fermés.

`HttpCommandAuth::default()` exige l'authentification et échoue fermé tant
qu'aucun vérificateur de token n'est configuré. Seul
`insecure_local_for_testing()` désactive explicitement l'authentification
command/query pour des tests locaux contrôlés. `/v1/health` reste public par
contrat. Les refus d'autorisation command sont audités avec des métadonnées
normalisées, sans credentials, payload ni clé d'idempotence.

## Prerelease 2.0 : reload coordonné du routing

La ligne source 2.0 ajoute le `ReloadableRuntimeHttpHost` opt-in non publié. Un
candidat doit avoir une génération strictement plus récente sur la même adresse
liée et réussir `/v1/health` avant et après une commutation atomique du routing.
Les requêtes déjà acceptées gardent leur Router initial jusqu'à leur fin ; la
génération précédente est drainée sous délai. Un échec de santé ou de drain
restaure l'ancienne génération et ferme l'admission de la génération défaillante.

Le pointeur actif est lock-free, les délais sont plafonnés à 60 secondes et le
snapshot contient uniquement les compteurs génération, in-flight, succès,
échec et rollback. La composition root peut transférer un listener TCP déjà lié
pour valider le bind avant démarrage. Les changements d'adresse exigent une
autre génération de listener préparée et ne sont pas inférés.

Cette API décrit seulement l'état du source. Elle ne doit pas être considérée
comme disponible dans le paquet stable `1.0.0` indiqué ci-dessus. Voir
[reload coordonné](/fr/architecture/reload).

**Maturité :** surface HTTP V1 stricte et stable.
