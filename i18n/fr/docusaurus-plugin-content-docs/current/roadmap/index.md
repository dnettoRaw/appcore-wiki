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
| [appcore-ui](/fr/crates/appcore-ui) | Beta | `0.1.0-beta.1` (crates.io). Frontière de surfaces UI pour pages HTML/TypeScript, vues natives Rust, lifecycle de fenêtre, événements, état visuel et futur page builder. |
| [appcore-filemaker-ai](/fr/crates/appcore-filemaker-ai) | Beta | Bridge d'outils facultatif et borné `0.1.0-beta.5` publié ; l'IA reste hors du compilateur déterministe. |
| [appcore-filemaker-cli](/fr/crates/appcore-filemaker-cli) | Beta | Adaptateur de processus borné `0.1.0-beta.5` publié pour compilation, diagnostic et export explicite. |

| [appcore-transfer](/fr/crates/appcore-transfer) | Beta | `0.1.0-beta.1` — crates.io. Transfert reprenable d'objets opaques immuables entre plusieurs pairs autorisés, avec blocs vérifiés, quotas et concurrence bornée ; distinct du routage mesh. |

## RC

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-log](/fr/crates/appcore-log) | RC | Pipeline de logging structuré et borné `1.0.0-rc.3` publié pour les composants Runtime et les applications SDK. |
| [appcore-sdk](/fr/crates/appcore-sdk) | RC | Façade applicative manifest-first `1.0.2-rc` publiée, remplaçant `appcore-bin` désormais retiré. |

## Alpha

| Composant | Statut | Frontière |
| --- | --- | --- |
| [appcore-sync-sqlite](/fr/crates/appcore-sync-sqlite) | Alpha | `0.1.0-alpha.7` publiée pour la persistance facultative de l'état sync du Runtime. |

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

MCU reste prévu ; nom, API, carte supportée et date de release sont provisoires. `appcore-transfer` est déjà publié en `0.1.0-beta.1`. La qualification restante sur matériel et mesh n’en fait pas un composant futur.

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

[appcore-transfer](/fr/crates/appcore-transfer) fournit déjà blocs immuables vérifiés, reprise durable, ordonnancement multisource borné et intégration optionnelle Peer RPC V2 signée existante. Découverte, routage mesh et relays conservent leurs propriétaires ; compatibilité BitTorrent, DHT publique et découverte anonyme restent hors contrat.

Qualification et intégration aux consommateurs encore à réaliser :

1. Mesurer débit, RAM et trafic sur réseaux partagés réels face à une source unique ; qualifier mesh physique et relays.
2. Exercer partitions réelles, coupures électriques et charges prolongées sur le matériel de deployment, avec preuves de récupération.
3. Valider les consommateurs update/snapshots optionnels en préservant authenticité, compatibilité, health gates et rollback.
4. Ajouter livraison MCU seulement après contrat host/device borné et preuves sur matériel réel. Un hash d’objet valide n’autorise pas installer du firmware.

### Validation Conjointe

Lorsque l'adaptateur hôte et le transfert multisource fonctionnent séparément,
valider un hôte/gateway recevant des blocs de pairs et livrant des parties
bornées au MCU. Servir directement des blocs depuis le MCU exige des preuves
propres de mémoire, stockage, énergie et connectivité. Installer du firmware
exige aussi un contrat revu de bootloader, authenticité, compatibilité, health
et rollback.

Les pistes préservent les trois artefacts, la composition explicite du deployment, les providers optionnels et les contrats versionnés. MCU exige implémentation et preuves de release avant le catalogue actif. Transfer est déjà une beta active ; sa promotion stable exige sa propre qualification revue.

## Règles De Promotion

- Les composants futurs n'entrent pas dans le graphe stable des crates.
- Planned plus crate absent est valide.
- Planned plus crate présent exige une revue et ne promeut rien automatiquement.
- Stable plus crate absent est une erreur.
- Les slugs doivent être préservés lorsqu'un composant mûrit.
- Une page future ne doit pas inclure commandes d'installation, versions inventées ou dates de release.
