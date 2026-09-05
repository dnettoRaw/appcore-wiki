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
