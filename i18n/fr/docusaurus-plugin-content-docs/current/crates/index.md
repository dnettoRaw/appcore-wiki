---
title: Catalogue des crates
sidebar_position: 0
slug: /crates/
---

# Catalogue des crates

AppCore `1.0.0` expose **22 crates publics**, tous publiés sur crates.io avec un
MSRV Rust `1.89`. Chaque crate public possède désormais son propre SemVer ; la
modification d'un crate n'oblige pas les paquets indépendants à publier ou à
adopter la même version. Les outils comme `appcore-certification`,
`appcore-dev` et `runtime-console` ne sont pas des crates Runtime publics.

La bêta publique [`appcore-ai 0.1.0-beta.3`](./appcore-ai), versionnée
séparément, est également publiée sur crates.io. Elle ne fait pas partie du
graphe stable des crates Runtime `1.0.0`.

L'intégration facultative
[`appcore-sync-sqlite 0.1.0-alpha.2`](./appcore-sync-sqlite) est une prerelease
post-1.0 publiée. Sa page documente la frontière acceptée et les preuves de
certification sans la présenter comme partie du catalogue stable. Le graphe
coordonné historique reste disponible en `2.0.0-alpha.1` ; les nouveaux
candidats sont versionnés par crate et les instructions stables pour les
applications restent en `1.0.0`.

Le train de publication du dépôt est actuellement `1.0.2-rc`, tandis que les
fonctionnalités compatibles avancent vers 1.5 uniquement dans les crates qui
les possèdent :

| Ligne candidate | Crates |
|---|---|
| Publications indépendantes existantes | `appcore-ai 0.1.0-beta.3`, `appcore-args 1.0.1`, `appcore-supervisor 1.0.1`, `appcore-transport 1.1.0-alpha.1` |
| `0.1.0-alpha.3` | `appcore-sync-sqlite` |
| `1.0.2-rc` | contracts, types, DNT, core, ops, control plane, capabilities, contrats provider, adapter Vercel/Neon, update |
| `1.5.0-alpha.1` | API, sécurité, stockage, peer RPC, contrats distribués, sync, scheduler, Gateway et hôte de composition ; les constats de compatibilité des crates concernés bloquent toujours une publication bêta ou stable |

Candidate désigne la version déclarée dans les sources, pas une publication
achevée. crates.io reste l'autorité pour les versions disponibles. La
stabilisation RC avance le patch de `1.0.0` à `1.0.9` selon les besoins, en
conservant le suffixe `-rc` tant que le build reste candidat, puis se termine au
prochain jalon indépendant `1.x.0`. Le développement de la version 2 n'a pas
commencé ; sa publication alpha historique ne définit pas la ligne source
actuelle.

Pour une nouvelle application, utiliser la façade de haut niveau :

```bash
cargo add appcore-bin@1.0.0
```

Dépendre directement d'un autre crate uniquement pour un consommateur bas
niveau ou un adapter provider. Chaque page indique responsabilité, frontière
de dépendances, limites importantes, liens du registre, guide et exemples
débutant et intermédiaire maintenus par le crate.

| # | Crate | Responsabilité | Dépendances AppCore directes |
| ---: | --- | --- | --- |
| 1 | [appcore-args](./appcore-args) | Parsing CLI, aide et complétion bornés | Aucune |
| 2 | [appcore-contracts](./appcore-contracts) | Manifests et policies versionnés | Aucune |
| 3 | [appcore-types](./appcore-types) | Identité, trace et erreurs validées | contracts |
| 4 | [appcore-transport](./appcore-transport) | Transport HTTP/TLS borné | Aucune |
| 5 | [appcore-supervisor](./appcore-supervisor) | Lifecycle des services et budgets de restart | Aucune |
| 6 | [appcore-distributed-contracts](./appcore-distributed-contracts) | Contrats wire/provider distribués | contracts, types |
| 7 | [appcore-dnt](./appcore-dnt) | Conteneur binaire chiffré et authentifié | contracts, types |
| 8 | [appcore-core](./appcore-core) | Lifecycle, registries et dispatch | contracts, types |
| 9 | [appcore-api](./appcore-api) | Host HTTP et DTOs Runtime | core, security, supervisor |
| 10 | [appcore-security](./appcore-security) | Tokens, secrets, keyring et policy | core, DNT |
| 11 | [appcore-storage](./appcore-storage) | Contrats storage, file provider et backup | contracts, DNT, security, types |
| 12 | [appcore-sync](./appcore-sync) | Réplication conservative leader-to-follower | core, distributed contracts, ops, transport |
| 13 | [appcore-ops](./appcore-ops) | Health et observabilité sans vendor | core |
| 14 | [appcore-scheduler](./appcore-scheduler) | Scheduling local borné et placement | contracts, core |
| 15 | [appcore-control-plane](./appcore-control-plane) | Présence, discovery, heartbeat et leases | contracts, core, distributed contracts, transport |
| 16 | [appcore-capabilities](./appcore-capabilities) | Registry et résolution des capabilities | contracts, core, distributed contracts |
| 17 | [appcore-peer-rpc](./appcore-peer-rpc) | Appels peer authentifiés et replay defense | core, distributed contracts, security, transport |
| 18 | [appcore-gateway](./appcore-gateway) | Relay WebSocket et mesh isolé par tenant | contracts, distributed contracts, peer RPC, security, transport, types |
| 19 | [appcore-provider](./appcore-provider) | Composition des providers et shared leases | contracts |
| 20 | [appcore-provider-vercel-neon](./appcore-provider-vercel-neon) | Adapter officiel Vercel/Neon isolé | contracts, control plane, provider |
| 21 | [appcore-update](./appcore-update) | Vérification, activation et rollback d'artifacts | contracts, provider |
| 22 | [appcore-bin](./appcore-bin) | Façade application, CLI et composition root | 17 crates AppCore |

Le graphe de dépendances est acyclique. Le code public d'une application doit
normalement s'arrêter à `appcore_bin::application` ; être publié ne fait pas
automatiquement d'un crate une surface d'intégration recommandée.

La bêta `appcore-ai`, l'aperçu en design [appcore-ui](./appcore-ui) et les
composants futurs sont suivis séparément dans la [roadmap future](/roadmap/)
afin que le travail pré-stable et prévu ne soit pas confondu avec le graphe
stable des crates.

## Propriété de la documentation

L'architecture et l'intégration globales du Runtime vivent dans ce wiki. Les
API détaillées et exemples exécutables vivent sous `crates/<crate>/wiki` dans
le dépôt Runtime afin d'évoluer avec leur code. Chaque crate public maintient un
guide et des exemples débutant et intermédiaire en anglais, portugais et
français.
