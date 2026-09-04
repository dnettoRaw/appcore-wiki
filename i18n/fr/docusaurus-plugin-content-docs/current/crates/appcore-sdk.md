---
title: appcore-sdk
sidebar_position: 28
---

# appcore-sdk

ID stable de documentation : **ACR-028**.

`appcore-sdk` est la façade des applications. Il offre une petite surface
orientée manifestes tandis que les crates spécialisés gardent la responsabilité
du stockage, scheduling, sync, AI, documents et déploiement.

Utilisez-le pour démarrer une application externe à trois artefacts,
implémenter `Application`, enregistrer le comportement ou activer les namespaces
optionnels. Il n'ouvre aucun listener implicitement, ne choisit pas de provider,
ne résout pas de secret et ne contrôle pas le processus.

Contrats principaux : `run`, `App`, `Application`, `manifest` et les namespaces
opt-in. Commencez par le [tutoriel](/fr/tutorials/first-application) et le
[guide complet du crate](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.fr.md).
Exécutez ensuite l’[exemple de base](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/basic.fr.md)
et l’[exemple intermédiaire](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/intermediate.fr.md).
