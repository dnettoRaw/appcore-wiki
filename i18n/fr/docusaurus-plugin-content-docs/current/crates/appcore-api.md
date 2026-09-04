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
ajouter resources REST produit ou schémas métier. Les applications utilisent
les contrats via `appcore-sdk/api` ; l'exécutable de déploiement possède le host HTTP.

Les queries applicatives sont autorisées par la policy capability composée
avant le router. Les queries de statut Runtime restent hors du catalogue
applicatif.

Sur la ligne de maintenance 1.0 actuelle, les hosts Runtime gèlent
l'enregistrement des queries de `ApiRouter` après le bootstrap. Les snapshots
du router partagent des endpoints immuables via `Arc` ; la façade directe, le
HTTP et le peer RPC libèrent le mutex d'état du host avant d'appeler
l'endpoint. Les queries indépendantes s'exécutent donc en parallèle et un
enregistrement tardif échoue avec `router_frozen`.
`query_names_iter` permet à la validation du manifest d'emprunter ce registre
immuable ; la méthode owned déterministe `query_names` reste disponible pour la
sortie. Avec 1 024 queries, le scan emprunté a mesuré 28,63 us p50 et 2,41 Mio
de RSS de pic, contre 183,26 us et 2,55 Mio pour la matérialisation complète.

La query intégrée `runtime.audit` limite chaque réponse aux 1 000 éléments les
plus récents. Elle capture des snapshots partagés des enregistrements et
entrées sous des locks courts, puis matérialise seulement cette page après leur
libération, au lieu de cloner en profondeur les deux files complètes de 10 000
éléments. Sélectionner 1 000 sur 10 000 a mesuré 2,06 us p50 et 11,88 Mio de RSS
de pic, contre 4,16 ms et 20,33 Mio pour les anciennes copies complètes.

`runtime.events` suit la même frontière de snapshot, limite la page récente à
1 000 et continue d'omettre les payloads opaques de sa réponse inchangée.
Sélectionner 1 000 sur 10 000 événements a mesuré 2,39 us p50 et 8,48 Mio de RSS
de pic, contre 2,09 ms et 14,59 Mio pour cloner tout l'historique.

La limite configurée s'applique au corps HTTP complet avant la
désérialisation JSON par Axum. Les routes protégées acceptent exactement un
header bearer `Authorization` bien formé; les doublons échouent fermés.

La validation de query structurée transmet le JSON à un writer compteur borné.
Elle applique ainsi la limite exacte d'octets sérialisés sans conserver un
`Vec<u8>` encodé, tandis que la méthode publique `payload_bytes()` reste
compatible. Le chemin HTTP ne valide qu'une fois avant le dispatch blocking.

Le router possède un seul `RuntimeStaticInfo` immuable partagé ; cloner l'état
de la requête ne copie ni les listes de peers, ni les seeds DNS, ni les paths ou
les chaînes d'identité. Le dispatch blocking prend possession des requêtes
command/query. L'audit query ne conserve que l'ID et le nom bornés pendant le
traitement du payload.
Les chemins command owned appellent `CommandRequest::into_envelope`, conservent
la validation V1 et déplacent l'allocation UTF-8 existante dans
`CommandEnvelope`. `to_envelope` reste disponible aux callers empruntés.

`CommandTokenVerifier` possède aussi des méthodes additives pour les requêtes
empruntées. Leurs defaults matérialisent `RequestValidationDetails` et appellent
les méthodes owned existantes, donc les verifiers existants gardent leur
comportement. Le verifier du Runtime les surcharge pour hasher directement le
texte ou le JSON structuré, sans copie owned du payload.

`HttpCommandAuth::default()` exige l'authentification et échoue fermé tant
qu'aucun vérificateur de token n'est configuré. Seul
`insecure_local_for_testing()` désactive explicitement l'authentification
command/query pour des tests locaux contrôlés. `/v1/health` reste public par
contrat. Les refus d'autorisation command sont audités avec des métadonnées
normalisées, sans credentials, payload ni clé d'idempotence.

## `1.0.2-rc` : reload coordonné du routing

La ligne candidate `1.0.2-rc` ajoute le `ReloadableRuntimeHttpHost` opt-in. Un
candidat doit avoir une génération strictement plus récente sur la même adresse
liée et réussir `/v1/health` avant et après une commutation atomique du routing.
Les requêtes déjà acceptées gardent leur Router initial jusqu'à leur fin ; la
génération précédente est drainée sous délai. Un échec de santé ou de drain
restaure l'ancienne génération et ferme l'admission de la génération défaillante.

Le owner conserve au plus une génération active et une en drain. Une génération
défaillante avec des requêtes bloque un autre reload jusqu'à ce que son dernier
permit libère le Router. `generation_snapshot` rapporte l'admission et
l'in-flight actif/en drain sans données de requête ni historique non borné. Une
annulation après la commutation restaure synchroniquement la génération
précédente.

Le pointeur actif est lock-free, les délais sont plafonnés à 60 secondes et le
snapshot contient uniquement les compteurs génération, in-flight, succès,
échec et rollback. La composition root peut transférer un listener TCP déjà lié
pour valider le bind avant démarrage. Les changements d'adresse exigent une
autre génération de listener préparée et ne sont pas inférés.

Cette API décrit seulement l'état du source. Elle ne doit pas être considérée
comme disponible dans le paquet stable `1.0.0` indiqué ci-dessus. Voir
[reload coordonné](/architecture/reload).

**Maturité :** surface HTTP V1 stricte et stable.
