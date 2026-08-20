---
title: Carte des crates
sidebar_position: 12
---

# Carte des crates

Quand un runtime grandit, les limites entre crates doivent expliquer l'architecture. Dans AppCore elles suivent l'ownership, pas la convenance.

La version stable `1.0.0` contient 22 crates publics, tous publiés sur
crates.io. Les fondations autonomes gardent un SemVer indépendant même lorsque
leurs numéros de version correspondent au Runtime. La référence détaillée se
trouve dans le [catalogue des crates](/crates/).

| Couche | Crates | Raison |
| --- | --- | --- |
| Fondations autonomes | `appcore-args`, `appcore-supervisor`, `appcore-transport` | composants réutilisables et versionnés indépendamment, sans dépendance AppCore |
| Contrats | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` | manifests, identités validées, contrats wire et composition provider |
| Runtime | `appcore-core`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-api`, `appcore-update` | comportement et infrastructure Runtime avec des frontières explicites |
| Intégrations | `appcore-gateway`, `appcore-provider-vercel-neon` | intégrations transport/provider opérées à l'extérieur |
| Composition | `appcore-bin` | seul crate autorisé à composer l'infrastructure concrète pour les applications |
| Outils | `appcore-dev`, `runtime-console`, outils de certification | développement, exploitation et preuves de release ; pas des crates publics |

Les fondations autonomes restent réutilisables et versionnées séparément.
`appcore-supervisor` gère les services en processus sans dépendre du dispatch
de commandes ; `appcore-args` parse la CLI sans exécuter de commandes Runtime.

`appcore-bin` est le seul composition root concret pour les applications. Les contrats ne dépendent pas des implémentations, et le code métier ne doit pas importer de modules privés du host.

## Limitations

- Cette carte explique l'ownership ; utiliser le
  [catalogue des crates](/crates/) pour les APIs, limites, maturité et liens
  registry.
- Les crates de tooling/certification peuvent ne pas faire partie de la surface applicative stable.
- Les modules internes peuvent changer même lorsque manifests et facade publique restent compatibles.
