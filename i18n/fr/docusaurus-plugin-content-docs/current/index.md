---
title: AppCore Runtime
sidebar_position: 1
---

# AppCore Runtime

AppCore est un runtime Rust pour les applications dont l'infrastructure doit être explicite : manifests, cycle de vie, dispatch des commands, storage, synchronisation, providers, Peer RPC, gateway, supervision et updates appartiennent au runtime, pas au boilerplate applicatif.

Lire ce manuel comme un livre technique :

1. [Ce qu'est AppCore](/fr/introduction/what-is-appcore)
2. [Le contrat à trois artefacts](/fr/architecture/three-artifact-contract)
3. [Bootstrap et runtime host](/fr/architecture/bootstrap)
4. [Storage, DNT, backup et restore](/fr/architecture/storage)
5. [Sync, logs, checkpoints et replay](/fr/architecture/synchronization)
6. [Fonctionnement distribué](/fr/architecture/distributed)
7. [Supervisor et cycle de vie](/fr/architecture/supervisor)
8. [Budgets de performance](/fr/architecture/performance-budgets)
9. [Updates](/fr/architecture/updates)
10. [Modèle de sécurité](/fr/security/security-model)
11. [Première application](/fr/tutorials/first-application)
12. [Exemples du niveau débutant à intermédiaire](/fr/tutorials/examples/)
13. [Référence des crates stables et des aperçus publiés](/fr/crates/)
14. [Roadmap future](/fr/roadmap/)

Version stable : `1.0.0`. Le catalogue source courant contient 28 crates
publics actifs, avec versions indépendantes et maturité explicite. Toolchain
Rust minimale : `1.89`. Le nouveau code applicatif commence par
[`appcore-sdk`](/fr/crates/appcore-sdk) ; les crates de niveau inférieur restent
disponibles lorsque leur contrat doit être utilisé directement. Consultez la
page de chaque crate avant de supposer qu’une prerelease source est publiée.

Le V1 stable est une promesse de compatibilité, pas un gel fonctionnel de tout
le dépôt. AppCore peut continuer à ajouter des capacités Runtime génériques et
des crates versionnés indépendamment tout en gardant les contrats V1 cohérents ;
un contrat incompatible exige une nouvelle version explicite.

## Et Ensuite

La roadmap future suit le travail prévu sans le mélanger à la référence
Runtime courante. Le travail en prerelease comprend
[appcore-ai](/fr/crates/appcore-ai),
[appcore-filemaker](/fr/crates/appcore-filemaker) et
[appcore-sync-sqlite](/fr/crates/appcore-sync-sqlite) ; l’aperçu en design
courant est [appcore-ui](/fr/crates/appcore-ui). Les zones
planifiées en haute priorité
incluent `appcore-test`, `appcore-jobs`, `appcore-search`,
`appcore-automation` et `appcore-plugin` ; voir la [roadmap future](/fr/roadmap/).

## Limites

Cette page est une carte de lecture, pas une référence API complète. Les chapitres décrivent le comportement opérationnel, les décisions et les limites.
