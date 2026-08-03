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
8. [Updates](/fr/architecture/updates)
9. [Modèle de sécurité](/fr/security/security-model)
10. [Première application](/fr/tutorials/first-application)

Ligne actuelle : `1.0.1-rc.8`. Toolchain Rust minimale : `1.89`.

