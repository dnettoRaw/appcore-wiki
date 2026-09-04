---
title: Roadmap future
description: Préreleases publiées, composants prévus et recherche AppCore.
sidebar_position: 1
slug: /roadmap/
---

# Roadmap future

:::caution Composants futurs
Cette roadmap sépare les prereleases et composants conceptuels du catalogue
actuel des crates publics. Les entrées Alpha, Beta ou RC restent opt-in et leur
page indique si elles sont publiées ; les entrées prévues et de recherche ne
doivent pas être utilisées comme dépendances.
:::

AppCore garde la documentation stable du Runtime séparée du design futur. Les
entrées ci-dessous réservent noms, frontières et intention afin de discuter les
crates prévus sans les présenter comme des APIs disponibles.

La promotion de statut est manuelle. Un composant peut conserver son slug en
passant de Research à Planned, In Design, Alpha, Beta, RC ou Stable, mais aucune
promotion n'est automatique parce qu'un crate apparaît dans le dépôt Runtime.

## Beta

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-ai](/crates/appcore-ai) | Beta | `0.1.0-beta.3` publiée pour routage borné, inférence locale/distante, ressources, provenance, sécurité et exécution observable. |
| [appcore-filemaker](/crates/appcore-filemaker) | Beta | `0.1.0-beta.1` publiée pour la compilation déterministe de documents, canvases vectoriels et datasets bornés. |
| [appcore-filemaker-ai](/crates/appcore-filemaker-ai) | Beta | Bridge d'outils facultatif et borné `0.1.0-beta.1` publié ; l'IA reste hors du compilateur déterministe. |
| [appcore-filemaker-cli](/crates/appcore-filemaker-cli) | Beta | Adaptateur de processus borné `0.1.0-beta.1` publié pour compilation, diagnostic et export explicite. |

## RC

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-log](/crates/appcore-log) | RC | Pipeline de logging structuré et borné `1.0.0-rc.1` publié pour les composants Runtime et les applications SDK. |
| [appcore-sdk](/crates/appcore-sdk) | RC | Façade applicative manifest-first `1.0.0-rc.1` publiée, remplaçant `appcore-bin` désormais retiré. |

## Alpha

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-sync-sqlite](/crates/appcore-sync-sqlite) | Alpha | `0.1.0-alpha.4` publiée pour la persistance facultative de l'état sync du Runtime. |

## In Design

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-ui](/crates/appcore-ui) | In Design | Frontière de surfaces UI pour pages HTML/TypeScript, vues natives Rust, lifecycle de fenêtre, événements, état visuel et futur page builder. |

## Haute Priorité

| Composant | Statut | Frontière |
| --- | --- | --- |
| `appcore-test` | Planned | Harness déterministe avec `TestAppCore`, horloge, storage, transport, peers, providers, IA, device/UI fake, fault injection et simulation réseau. |
| `appcore-jobs` | Planned | Lifecycle durable : Created, Queued, Running, Completed, Failed ou Retry. Scheduler décide quand et où ; jobs possède persistance et lifecycle. |
| `appcore-search` | Planned | Frontière local-first pour full-text, metadata, filtres et ranking, avec retrieval vector/hybrid possible plus tard sans promettre une base vectorielle propre. |
| `appcore-automation` | Planned | Workflow déterministe `Event -> Condition -> Action -> Command` avec IA optionnelle et future édition visuelle. |
| `appcore-plugin` | Planned | Extensibilité pour providers, backends IA, composants UI, adapters device et intégrations, en commençant par composition Rust statique. |

## Expansion Plateforme

| Composant | Statut | Frontière |
| --- | --- | --- |
| `appcore-media` | Planned | Audio, vidéo, capture, playback, encode/decode et streaming pour UI, IA et applications sans engagement sur les codecs. |
| `appcore-device` | Planned | Frontière contrôlée par capabilities pour USB, Bluetooth, serial, HID, capteurs, caméra, micro, displays et découverte GPU/NPU. |
| `appcore-agent` | Planned | Objectif, planning, outils, mémoire et actions au-dessus de l'IA, sans mélanger agent et inférence. |
| `appcore-data` | Planned | `Source -> Decode -> Validate -> Transform -> Batch/Stream -> Sink` ; pas un ORM ni dataframe par défaut. |
| `appcore-cache` | Planned | Petit cache borné avec TTL, eviction et métriques ; pas un concurrent de Redis. |
| `appcore-runtime-sdk` | Planned | Façade ergonomique comme `app.ai()`, `app.ui()` et `app.storage()` au-dessus des surfaces existantes, pas une seconde implémentation. |

## En Évaluation

| Composant | Statut | Frontière |
| --- | --- | --- |
| `appcore-events` | Research | Candidat event bus seulement si l'analyse prouve que la responsabilité des événements est assez dispersée. |
| `appcore-config` | Research | Candidat pour couches defaults, file, env, CLI et deployment ; `appcore-args` reste propriétaire de la CLI. |
| `appcore-secrets` | Research | Séparation possible de security seulement si résolution, rotation, scope et audit des secrets exigent un propriétaire propre. |
| `appcore-sandbox` | Research | Candidat frontière d'isolation ; aucune garantie de sandboxing n'est affirmée avant implémentation et threat model. |

## Recherche Future

| Composant | Statut | Frontière |
| --- | --- | --- |
| `appcore-browser` | Research | Recherche de browser et automation web contrôlée, sans engagement à devenir un browser engine. |
| `appcore-spatial` | Research | Évolution UI possible vers scene, XR, AR ou VR. |
| `appcore-sim` | Research | Simulation déterministe de clusters, devices, réseau et pression, distincte de `appcore-test`. |
| `appcore-cloud` | Research | Recherche d'abstraction deployment/orchestration, pas un cloud provider. |

## Règles De Promotion

- Les composants futurs n'entrent pas dans le graphe stable des crates.
- Planned plus crate absent est valide.
- Planned plus crate présent exige une revue et ne promeut rien automatiquement.
- Stable plus crate absent est une erreur.
- Les slugs doivent être préservés lorsqu'un composant mûrit.
- Une page future ne doit pas inclure commandes d'installation, versions inventées ou dates de release.
