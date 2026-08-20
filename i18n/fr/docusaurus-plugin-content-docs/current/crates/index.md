---
title: Catalogue des crates
sidebar_position: 0
slug: /crates/
---

# Catalogue des crates

AppCore expose **22 crates publics**, tous avec un MSRV Rust `1.89`. Le workspace
prépare `1.0.1-rc.9` pour les 21 crates d'origine ; leur dernière version
publiée reste `1.0.1-rc.8`. Le crate autonome `appcore-args` possède sa propre
ligne SemVer : `1.0.1-rc.9` est publié et le workspace est en `1.0.1-rc.10`.
Les outils comme `appcore-certification`, `appcore-dev` et `runtime-console` ne
sont pas des crates Runtime publics.

Pour une nouvelle application, utiliser la façade de haut niveau :

```bash
cargo add appcore-bin@1.0.1-rc.8
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
| 22 | [appcore-bin](./appcore-bin) | Façade application, CLI et composition root | 16 crates AppCore |

Le graphe de dépendances est acyclique. Le code public d'une application doit
normalement s'arrêter à `appcore_bin::application` ; être publié ne fait pas
automatiquement d'un crate une surface d'intégration recommandée.

## Propriété de la documentation

L'architecture et l'intégration globales du Runtime vivent dans ce wiki. Les
API détaillées et exemples exécutables vivent sous `crates/<crate>/wiki` dans
le dépôt Runtime afin d'évoluer avec leur code. Chaque crate public maintient un
guide et des exemples débutant et intermédiaire en anglais, portugais et
français.
