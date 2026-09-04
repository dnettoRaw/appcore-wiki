---
title: Catalogue des crates
sidebar_position: 0
slug: /crates/
---

# Catalogue des crates

AppCore-Runtime contient 28 crates publics actifs. Chaque paquet possède son
SemVer indépendant et une couche explicite. La release d'un crate n'oblige pas
les paquets sans rapport à changer de version.

Commencez une application avec [`appcore-sdk`](/fr/crates/appcore-sdk). Dépendez
d'un crate de bas niveau seulement si son contrat est directement nécessaire.

## Liens stables de documentation

Chaque crate possède un ID permanent entre ACR-001 et ACR-028. Utilisez ces URL
dans les READMEs, issues, releases et documents externes :

```text
https://wiki.appcore.dnettoraw.com/fr/crates/id/acr-028
```

L'ID redirige vers la page courante même si le slug change. Les IDs ne sont
jamais réutilisés. Consultez le [registre complet](./registry).

## Couches

| Couche | Responsabilité | Crates |
|---|---|---|
| Standalone | Bibliothèques génériques bornées sans dépendance AppCore | `appcore-args`, `appcore-supervisor`, `appcore-transport` |
| Contrat | Manifestes, identités, formats wire et providers versionnés | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` |
| Runtime | Lifecycle, sécurité, données, coordination, observabilité, AI et documents | `appcore-core`, `appcore-api`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-log`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-update`, `appcore-ai`, `appcore-filemaker` |
| Intégration | Adapters explicites d'infrastructure externe ou optionnelle | `appcore-gateway`, `appcore-provider-vercel-neon`, `appcore-sync-sqlite` |
| Adapter | Interfaces développeur/modèle autour d'un core déterministe | `appcore-filemaker-ai`, `appcore-filemaker-cli` |
| Façade | Frontière de composition destinée aux applications | `appcore-sdk` |

Le graphe reste acyclique. Les contrats ne dépendent pas des implémentations et
les crates standalone ne dépendent pas d'AppCore. Un prerelease n'entre jamais
silencieusement dans un déploiement stable.

## Propriété de la documentation

Chaque README explique responsabilité, exclusions, contrats publics, exemple
minimal, limites, validation et ID stable du wiki. Les guides spécifiques
restent dans `crates/<nom>/wiki`; architecture et exploitation communes restent
dans ce wiki public.

Les pages historiques `appcore-bin`, `appcore-filemaker-yaml` et `appcore-ui`
ne sont pas des entrées actives du catalogue.
