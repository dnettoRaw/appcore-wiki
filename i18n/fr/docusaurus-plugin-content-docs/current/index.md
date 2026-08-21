---
title: AppCore Runtime
sidebar_position: 1
---

# AppCore Runtime

AppCore est un runtime Rust pour les applications dont l'infrastructure doit être explicite : manifests, cycle de vie, dispatch des commands, storage, synchronisation, providers, Peer RPC, gateway, supervision et updates appartiennent au runtime, pas au boilerplate applicatif.

Lire ce manuel comme un livre technique :

1. [Ce qu'est AppCore](/introduction/what-is-appcore)
2. [Le contrat à trois artefacts](/architecture/three-artifact-contract)
3. [Bootstrap et runtime host](/architecture/bootstrap)
4. [Storage, DNT, backup et restore](/architecture/storage)
5. [Sync, logs, checkpoints et replay](/architecture/synchronization)
6. [Fonctionnement distribué](/architecture/distributed)
7. [Supervisor et cycle de vie](/architecture/supervisor)
8. [Updates](/architecture/updates)
9. [Modèle de sécurité](/security/security-model)
10. [Première application](/tutorials/first-application)
11. [Exemples du niveau débutant à intermédiaire](/tutorials/examples/)
12. [Référence des 22 crates publics](/crates/)
13. [Roadmap future](/roadmap/)

Version stable : `1.0.0`. Les 22 crates publics sont disponibles sur crates.io.
Toolchain Rust minimale : `1.89`. Une application doit normalement dépendre de
`appcore-bin@1.0.0` et utiliser sa façade `application`.

## Et Ensuite

La roadmap future suit le travail prévu sans le mélanger à la référence stable
du Runtime. Les aperçus en design sont [appcore-ai](/crates/appcore-ai) et
[appcore-ui](/crates/appcore-ui). Les zones planifiées en haute priorité
incluent `appcore-test`, `appcore-jobs`, `appcore-search`,
`appcore-automation` et `appcore-plugin` ; voir la [roadmap future](/roadmap/).

## Limites

Cette page est une carte de lecture, pas une référence API complète. Les chapitres décrivent le comportement opérationnel, les décisions et les limites.
