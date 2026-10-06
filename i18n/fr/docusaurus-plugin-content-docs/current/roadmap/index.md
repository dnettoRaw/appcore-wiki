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
| [appcore-ai](/fr/crates/appcore-ai) | Beta | `0.1.0-beta.5` publiée pour routage borné, inférence locale/distante, ressources, provenance, sécurité et exécution observable. |
| [appcore-filemaker](/fr/crates/appcore-filemaker) | Beta | `0.1.0-beta.6` publiée pour la compilation déterministe de documents, canvases vectoriels et datasets bornés. |
| [appcore-filemaker-ai](/fr/crates/appcore-filemaker-ai) | Beta | Bridge d'outils facultatif et borné `0.1.0-beta.5` publié ; l'IA reste hors du compilateur déterministe. |
| [appcore-filemaker-cli](/fr/crates/appcore-filemaker-cli) | Beta | Adaptateur de processus borné `0.1.0-beta.5` publié pour compilation, diagnostic et export explicite. |

## RC

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-log](/fr/crates/appcore-log) | RC | Pipeline de logging structuré et borné `1.0.0-rc.3` publié pour les composants Runtime et les applications SDK. |
| [appcore-sdk](/fr/crates/appcore-sdk) | RC | Façade applicative manifest-first `1.0.2-rc` publiée, remplaçant `appcore-bin` désormais retiré. |

## Alpha

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-sync-sqlite](/fr/crates/appcore-sync-sqlite) | Alpha | `0.1.0-alpha.7` publiée pour la persistance facultative de l'état sync du Runtime. |

## In Design

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-ui](/fr/crates/appcore-ui) | In Design | Frontière de surfaces UI pour pages HTML/TypeScript, vues natives Rust, lifecycle de fenêtre, événements, état visuel et futur page builder. |

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
| `appcore-mcu` | Planned | Intégration légère et authentifiée de microcontrôleurs, avec messages et capabilities bornés ; profil firmware `no_std` optionnel et pilotes appartenant à l'application. |
| `appcore-transfer` | Beta | 0.1.0-beta.1 — crates.io.  Transfert reprenable d'objets opaques immuables entre plusieurs pairs autorisés, avec blocs vérifiés, quotas et concurrence bornée ; distinct du routage mesh. |
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

## MCU et Transfert Mesh

Les deux capacités sont prévues. Les noms des crates restent provisoires ;
aucune API, carte supportée, version ou date de livraison n'est engagée.

### Intégration de Microcontrôleurs

`appcore-mcu` permettrait aux appareils contraints de participer avec identité,
authentification, capabilities déclarées, commandes/événements bornés et état
de disponibilité explicite. Évaluer une bibliothèque firmware légère `no_std`
séparément de l'adaptateur hôte. Pilotes, HAL, capteurs, actionneurs et
comportement appartiennent au firmware applicatif ou aux adaptateurs matériels.
Un MCU n'est pas automatiquement un Core Runtime complet. Coordonner avec
`appcore-device` pour éviter le chevauchement de l'accès matériel côté hôte.

Étapes d'implémentation :

1. Choisir une carte pilote, définir les budgets RAM/flash/connectivité et
   revoir le contrat versionné, le provisionnement, l'autorisation et le replay.
2. Implémenter le codec borné et l'adaptateur hôte ; tester frames invalides,
   saturation, reconnexion, annulation et arrêt de l'hôte.
3. Valider boot, coupure électrique et récupération sur matériel réel ; publier
   limites mesurées et exemples basiques/intermédiaires en anglais, portugais et
   français avant d'élargir les cibles.

### Transfert entre Plusieurs Pairs

`appcore-transfer` récupérerait les blocs d'un objet immuable depuis plusieurs
pairs autorisés, vérifierait chaque bloc et l'objet complet, puis reprendrait
après interruption. Réutiliser les streams Peer RPC authentifiés existants,
avec V2 lorsque pertinent, sans protocole de transport parallèle.
La distribution inspirée de torrent ne promet ni compatibilité BitTorrent,
ni DHT publique, ni découverte anonyme. Découverte, routage mesh et relays
conservent leurs propriétaires actuels.

Étapes d'implémentation :

1. Revoir les API chunks/source/writer et définir un descripteur fiable et borné ;
   prouver un transfert vérifié entre deux nœuds sans charger l'objet entier
   en mémoire.
2. Ajouter progression durable versionnée, cache avec quotas et publication
   atomique ; tester corruption, crashes, writers concurrents et disque plein.
3. Ajouter ordonnancement borné entre sources, sélection de pairs et intégration
   relay ; tester partitions et pairs invalides, mesurer débit, RAM et trafic
   face à une source unique, y compris sur réseaux partagés.
4. Ajouter consommateurs update/snapshots optionnels et exemples traduits.
   Sync conserve leader-follower ; update conserve authenticité des releases,
   compatibilité, activation, health gates et rollback. Un hash valide seul
   ne prouve pas l'authenticité et n'autorise pas l'installation.

### Validation Conjointe

Lorsque l'adaptateur hôte et le transfert multisource fonctionnent séparément,
valider un hôte/gateway recevant des blocs de pairs et livrant des parties
bornées au MCU. Servir directement des blocs depuis le MCU exige des preuves
propres de mémoire, stockage, énergie et connectivité. Installer du firmware
exige aussi un contrat revu de bootloader, authenticité, compatibilité, health
et rollback.

Les deux pistes préservent les trois artefacts, la composition explicite du
deployment, les providers optionnels et les contrats versionnés actuels.
Chaque étape exige budgets, tests de panne et documentation ; les API publiques
ajoutent consumers et gates SemVer. Ces capacités entrent dans le catalogue
stable seulement après implémentation et preuves de release.

## Règles De Promotion

- Les composants futurs n'entrent pas dans le graphe stable des crates.
- Planned plus crate absent est valide.
- Planned plus crate présent exige une revue et ne promeut rien automatiquement.
- Stable plus crate absent est une erreur.
- Les slugs doivent être préservés lorsqu'un composant mûrit.
- Une page future ne doit pas inclure commandes d'installation, versions inventées ou dates de release.

## Candidat beta du transfert

Le transfert est implémenté localement en **0.1.0-beta.1**, publié sur crates.io : blocs immuables vérifiés, reprise durable, sources multiples autorisées et bornées, intégration Peer RPC V2 signée existante. MCU reste prévu ; qualification matérielle et mesh physique restent à réaliser.

[appcore-transfer](/fr/crates/appcore-transfer).
