---
title: Catalogue des crates
sidebar_position: 0
slug: /crates/
---

# Catalogue des crates

AppCore Runtime `1.0.1-rc.8` comprend **21 crates Runtime**. Les 21 ont été
vérifiés comme publiés sur crates.io le 18 août 2026 et déclarent un MSRV Rust
`1.89`. Les outils `appcore-certification` et `runtime-console` appartiennent au
workspace mais ne sont pas comptés comme crates Runtime.

Pour une nouvelle application, utiliser la façade de haut niveau :

```bash
cargo add appcore-bin@1.0.1-rc.8
```

Dépendre directement d'un autre crate uniquement pour un consommateur bas
niveau ou un adapter provider. Chaque page indique responsabilité, dépendances
AppCore directes, API principale, limites, maturité et liens exacts vers
crates.io et docs.rs.

| # | Crate | Responsabilité | Dépendances AppCore directes |
| ---: | --- | --- | --- |
| 1 | [appcore-contracts](./appcore-contracts) | Manifests et policies versionnés | Aucune |
| 2 | [appcore-types](./appcore-types) | Identité, trace et erreurs validées | contracts |
| 3 | [appcore-transport](./appcore-transport) | Transport HTTP/TLS borné | Aucune |
| 4 | [appcore-supervisor](./appcore-supervisor) | Lifecycle des services et budgets de restart | Aucune |
| 5 | [appcore-distributed-contracts](./appcore-distributed-contracts) | Contrats wire/provider distribués | contracts, types |
| 6 | [appcore-dnt](./appcore-dnt) | Conteneur binaire chiffré et authentifié | contracts, types |
| 7 | [appcore-core](./appcore-core) | Lifecycle, registries et dispatch | contracts, types |
| 8 | [appcore-api](./appcore-api) | Host HTTP et DTOs Runtime | core, security, supervisor |
| 9 | [appcore-security](./appcore-security) | Tokens, secrets, keyring et policy | core, DNT |
| 10 | [appcore-storage](./appcore-storage) | Contrats storage, file provider et backup | contracts, DNT, security, types |
| 11 | [appcore-sync](./appcore-sync) | Réplication conservative leader-to-follower | core, distributed contracts, ops, transport |
| 12 | [appcore-ops](./appcore-ops) | Health et observabilité sans vendor | core |
| 13 | [appcore-scheduler](./appcore-scheduler) | Scheduling local borné et placement | contracts, core |
| 14 | [appcore-control-plane](./appcore-control-plane) | Présence, discovery, heartbeat et leases | contracts, core, distributed contracts, transport |
| 15 | [appcore-capabilities](./appcore-capabilities) | Registry et résolution des capabilities | contracts, core, distributed contracts |
| 16 | [appcore-peer-rpc](./appcore-peer-rpc) | Appels peer authentifiés et replay defense | core, distributed contracts, security, transport |
| 17 | [appcore-gateway](./appcore-gateway) | Relay WebSocket et mesh isolé par tenant | contracts, core, distributed contracts, peer RPC, security, transport, types |
| 18 | [appcore-provider](./appcore-provider) | Composition des providers et shared leases | contracts |
| 19 | [appcore-provider-vercel-neon](./appcore-provider-vercel-neon) | Adapter officiel Vercel/Neon isolé | contracts, control plane, provider |
| 20 | [appcore-update](./appcore-update) | Vérification, activation et rollback d'artifacts | contracts, provider |
| 21 | [appcore-bin](./appcore-bin) | Façade application, CLI et composition root | 15 crates Runtime |

Le graphe de dépendances est acyclique. Le code public d'une application doit
normalement s'arrêter à `appcore_bin::application` ; être publié ne fait pas
automatiquement d'un crate une surface d'intégration recommandée.
