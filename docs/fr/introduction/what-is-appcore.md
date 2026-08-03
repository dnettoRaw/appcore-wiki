---
title: Ce qu'est AppCore
sidebar_position: 1
---

# Ce qu'est AppCore

Imaginez la même application installée dans deux contextes. Dans une boutique, elle tourne sur un notebook et doit continuer sans Internet. Dans une autre installation, elle tourne en cluster avec control plane, leases, Peer RPC et update supervisé. Le code métier ne devrait pas avoir deux architectures.

AppCore existe pour cette frontière.

Ce n'est pas un framework web, une base de données, un ERP ou une plateforme métier. C'est un runtime host qui rend les décisions d'infrastructure explicites, versionnées et testables.

## Le problème

Les backends ordinaires accumulent de l'infrastructure cachée : configuration mélangée avec identité, chemins, secrets et endpoints ; retries dans les handlers ; jobs hors cycle de vie ; update avant preuve de health ; leadership distribué sans fencing.

AppCore sépare l'ownership :

| Contrat | Propriétaire | Contient | Ne contient pas |
| --- | --- | --- | --- |
| Application Manifest | application | identité, compatibilité, capabilities, exigences | chemins, provider IDs, endpoints, secrets |
| Deployment Manifest | installation | mode, providers, réseau, chemins, secret refs, watchdog | règles métier, schémas, source |
| Runtime Manifest | runtime | version observée, node/core, health, plateforme | overrides utilisateur |
| Code métier | application | commands, queries, handlers, state, decisions | composition du runtime |

```mermaid
flowchart TB
    App[Application externe] --> Host[appcore-bin host]
    Manifest[application.toml] --> Host
    Deployment[deployment.toml] --> Host
    Host --> Providers[Providers sélectionnés]
    Host --> Services[Services supervisés]
    Host --> API[API command/query]
```

## Quand l'utiliser

Utilisez AppCore pour local-first, cluster, commands/queries explicites, storage durable, backup/restore, health/status, services supervisés, sync avec checkpoints, Peer RPC, gateway ou updates avec staging, health gate et rollback.

## Quand l'éviter

Évitez-le lorsqu'un serveur HTTP stateless et une base managée suffisent. AppCore ne fournit pas ORM, OAuth, vault managé, terminaison TLS universelle, RAFT, consensus multi-master ou résolution automatique de conflits métier.

Chapitre suivant : [contrat à trois artefacts](/fr/architecture/three-artifact-contract).

