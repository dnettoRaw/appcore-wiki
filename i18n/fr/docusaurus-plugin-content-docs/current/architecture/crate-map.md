---
title: Carte des crates
sidebar_position: 12
---

# Carte des crates

Quand un runtime grandit, les limites entre crates doivent expliquer l'architecture. Dans AppCore elles suivent l'ownership, pas la convenance.

La version stable `1.0.0` contient 22 crates publics, tous publiés sur
crates.io. Chaque crate public possède son propre SemVer, même lorsque
plusieurs numéros de version coïncident. La référence détaillée se trouve dans
le [catalogue des crates](/crates/).

| Couche | Crates | Raison |
| --- | --- | --- |
| Fondations autonomes | `appcore-args`, `appcore-supervisor`, `appcore-transport` | composants réutilisables et versionnés indépendamment, sans dépendance AppCore |
| Contrats | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` | manifests, identités validées, contrats wire et composition provider |
| Runtime | `appcore-core`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-api`, `appcore-update` | comportement et infrastructure Runtime avec des frontières explicites |
| Intégrations | `appcore-gateway`, `appcore-provider-vercel-neon` | intégrations transport/provider opérées à l'extérieur |
| Composition | `appcore-bin` | seul crate autorisé à composer l'infrastructure concrète pour les applications |
| Outils | `appcore-dev`, `runtime-console`, outils de certification | développement, exploitation et preuves de release ; pas des crates publics |

Tous les paquets publics sont versionnés séparément. Les fondations autonomes
restent aussi réutilisables sans dépendance AppCore. `appcore-supervisor` gère
les services en processus sans dépendre du dispatch de commandes ;
`appcore-args` parse la CLI sans exécuter de commandes Runtime.

`appcore-bin` est le seul composition root concret pour les applications. Les contrats ne dépendent pas des implémentations, et le code métier ne doit pas importer de modules privés du host.

## Tests de fuzz

Le dépôt source contient un workspace privé central avec 12 cibles bornées
pour les frontières qui reçoivent du texte ou des octets non fiables. Il couvre
le parsing CLI, les manifests et identifiants, le framing HTTP, les messages
distribués, les conteneurs DNT, les requêtes API, les jetons de sécurité, les
chemins de storage, les enveloppes de sync, Peer RPC, les DTO du gateway et les
descripteurs d'update. `appcore-ai` et `appcore-filemaker` conservent leurs
workspaces spécialisés près de leurs implémentations.

Exécuter `appcore-dev test fuzz` compile tous les workspaces de fuzz avec leurs
dépendances verrouillées. Le même gate utilise les lockfiles commités des
consumers externes SDK et three-artifact et échoue au lieu de modifier
silencieusement une fixture. Chaque cible rejette les entrées de plus de
256 KiB avant d'appeler la frontière. Le code de cycle de vie avec état reste
couvert par des tests déterministes, de propriétés, de concurrence et
d'intégration, car des octets aléatoires ne représentent pas utilement ces
invariants.

## Limitations

- Cette carte explique l'ownership ; utiliser le
  [catalogue des crates](/crates/) pour les APIs, limites, maturité et liens
  registry.
- Les crates de tooling/certification peuvent ne pas faire partie de la surface applicative stable.
- Les modules internes peuvent changer même lorsque manifests et facade publique restent compatibles.
