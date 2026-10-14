---
title: Bootstrap et composition du deployment
sidebar_position: 3
---

# Bootstrap et composition du deployment

Le SDK prépare le comportement applicatif ; il ne fournit ni host de processus
Runtime ni CLI. La composition du processus appartient au deployment.

## Contexte local et préparation

`App::new` construit des manifests V1 canoniques validés en mémoire.
`appcore_sdk::run` crée ce contexte et appelle une closure ; il ne lit pas de
fichiers de manifest et ne démarre ni listeners, ni storage, sync ou cluster.
Les manifests explicites remplacent les defaults via les méthodes validées.

`App::prepare` enregistre le comportement et retourne `PreparedApplication`.
Cette valeur possède les registries Core et callbacks. Avec `api`, les queries
sont enregistrées dans un router figé ; avec `scheduler`, les tasks sont
collectées dans un registry borné. Préparer n'est pas démarrer des services.

## Valider avant de démarrer les services

Un deployment qui lit des fichiers doit borner la lecture avant allocation,
valider UTF-8 et les schemas versionnés, puis vérifier l'identité applicative
des manifests. Un budget de 1 Mio avec `Take(limit + 1)` est une politique
explicite utile du deployment, pas une garantie automatique du filesystem SDK.
Ne pas inférer ni convertir les anciennes entrées supprimées ; les contrats
supprimés rejetés utilisent `NO MORE SUPPORTED PLEASE UPDATE`.

Résoudre descriptors, références de secrets et bindings avant les services.
Rejeter les providers inconnus et garanties insuffisantes sans fallback.
La configuration applicative reçoit un `DeploymentContext` validé ; la
composition de l'infrastructure reste hors des hooks métier.

## Connecter l'application préparée

Le deployment choisit listeners, authentification, budgets de payload, TTL des
tokens et d'idempotence, politiques sync/cluster et configuration Supervisor.
Déclarer un provider ID dans un manifest n'instancie pas son implémentation.

Composer un `CapabilityCatalog` partagé pour HTTP, appels directs et Peer RPC
lorsqu'ils sont activés. Vérifier déclaration, mode, idempotence, politique
d'écriture et leadership avant les handlers. Enregistrer des capabilities
locales uniquement pour de vrais handlers. Le SDK ne connecte pas
automatiquement ce catalogue à tous les transports.

## Startup et shutdown

Enregistrer les services gérés auprès du Supervisor, déclarer les dépendances
et prouver readiness avec des probes bornés. Le deployment possède signaux,
restart et activation/rollback des updates. Le shutdown est coopératif ; la
quarantine ne termine pas sûrement des threads Rust arbitraires. Tester startup
réel, dégradation et shutdown séparément de la préparation.

Les générations HTTP sont des primitives opt-in : le [reload coordonné](./reload)
ne surveille pas les manifests et ne change pas automatiquement les listeners.

## Preuves et limites

Les tests consommateurs SDK prouvent manifests, enregistrement et dispatch
dans leur périmètre, pas un cluster de production ni un host caché. Les
deployments externes doivent fournir des preuves pour service manager, réseau,
récupération et ressources. Aucune inférence de providers, aucun fallback
silencieux ni parser de compatibilité n'est implicite.

Suivant : [storage](/fr/architecture/storage).

## Identité de l’opération et récupération de la finalisation

Contrat source non publié : la clé est unique dans le store ; `command-v2:` lie l’ID de l’application, le nom du command et le payload délimité par longueur avec SHA-256. Node, ID de requête, date et trace restent des métadonnées de transport modifiables lors d’une répétition. Une autre application ou opération avec la même clé retourne `IdempotencyConflict`. Les empreintes du seul payload échouent au dispatch avec `NO MORE SUPPORTED PLEASE UPDATE`, sans conversion. Drainez et réconciliez l’ancienne installation, archivez son store et sélectionnez explicitement un nouveau store avant la mise à jour. Le rollback utilise l’exécutable et le store originaux, sans mélange.

Au plus 64 finalisations avec clé, actives ou récupérables, sont admises, avec un résultat sérialisé de 1 MiB maximum chacune (64 MiB de corps conservés). Un échec d’écriture du reçu conserve le résultat dans le buffer partagé du controller. Une répétition identique persiste le même reçu et publie les événements une fois dans ce processus sans réexécuter le handler, y compris après une écriture ambiguë déjà réalisée. `recoverable_command_completions` compte les résultats conservés. Un buffer plein rejette avant le handler. Un résultat trop grand laisse une réservation durable en attente de réconciliation.

L’ouverture du fichier et la compaction TTL conservent `Pending` ; seuls les reçus résolus expirent. Après perte du processus, le dispatch ne déduit jamais l’effet externe. L’application/deployment de confiance réconcilie la preuve autoritative puis appelle `recover_pending_command` avec l’opération originale et son résultat borné. Les réservations actives, résolues, absentes ou divergentes sont rejetées. Un échec normal du handler libère la réservation lorsque sa suppression réussit.

Effet applicatif, persistance du reçu et publication des événements sont des frontières distinctes. Un crash entre reçu et publication peut encore perdre la publication. L’EventBus borné et son journal opérationnel optionnel ne forment pas une outbox transactionnelle applicative. Pour une récupération durable, validez effet, résultat autoritatif et IDs stables des événements dans la transaction/outbox de l’application et dédupliquez les consommateurs. Ne supprimez pas une réservation en attente et ne créez pas une nouvelle clé pour contourner l’incertitude.

## Admission async

Correction source non publiée : l’admission d’exécution et l’attente single-flight du chargement suspendent avec `futures_timer::Delay`, indépendant de l’exécuteur ; aucune n’attend un Condvar sur le thread du router async. Les limites de file, priorité et places sélectionnées restent appliquées. Abandonner une future en attente libère son entrée et toute place sélectionnée. Annulation et deadline sont vérifiées à l’intervalle configuré (chargement : 10 ms), sans mutex conservé pendant await. Le timer utilise un thread auxiliaire partagé, pas un worker par requête. Chaque backend reste responsable de l’annulation coopérative et de l’isolation de son travail bloquant. Une régression sur un seul thread couvre chargement suspendu, exécution saturée et concurrence d’admission au chargement.
