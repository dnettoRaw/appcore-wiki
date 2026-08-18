---
title: Carte des crates
sidebar_position: 12
---

# Carte des crates

Quand un runtime grandit, les limites entre crates doivent expliquer l'architecture. Dans AppCore elles suivent l'ownership, pas la convenance.

Le workspace `1.0.1-rc.8` comprend 21 crates Runtime, tous publiés sur
crates.io. La référence détaillée se trouve dans le
[catalogue des crates](/crates/).

| Couche | Crates | Raison |
| --- | --- | --- |
| Base | `appcore-contracts`, `appcore-types`, `appcore-transport`, `appcore-dnt` | contrats réutilisables, IDs validés, transport borné et enveloppes chiffrées sans composition concrète |
| Lifecycle | `appcore-supervisor` | graphe de services, restart policy, watchdog et quarantaine indépendants du dispatch |
| Core | `appcore-core` | registries command/event/state/decision, identité, lifecycle, audit et idempotence |
| Services Runtime | `appcore-api`, `appcore-storage`, `appcore-security`, `appcore-ops`, `appcore-scheduler`, `appcore-sync` | une responsabilité d'infrastructure par crate |
| Distribué | `appcore-distributed-contracts`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-gateway` | contrats wire, présence, discovery, leases, routage capability, peer transport et relay Gateway |
| Composition | `appcore-provider`, `appcore-update`, `appcore-provider-vercel-neon` | factories provider, plans de deployment, adapters officiels et lifecycle update |
| Host | `appcore-bin` | seul crate autorisé à composer l'infrastructure concrète pour les applications |
| Tools | `runtime-console`, outils de certification | workflows opérateur et preuves de release |

Les tools sont des utilitaires du workspace et ne comptent pas parmi les 21
crates Runtime.

`appcore-bin` est le seul composition root concret pour les applications. Les contrats ne dépendent pas des implémentations, et le code métier ne doit pas importer de modules privés du host.

## Limitations

- Cette carte explique l'ownership ; utiliser le
  [catalogue des crates](/crates/) pour les APIs, limites, maturité et liens
  registry.
- Les crates de tooling/certification peuvent ne pas faire partie de la surface applicative stable.
- Les modules internes peuvent changer même lorsque manifests et facade publique restent compatibles.
