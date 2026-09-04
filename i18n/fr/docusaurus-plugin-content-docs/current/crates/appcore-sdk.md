---
title: appcore-sdk
sidebar_position: 28
---

# appcore-sdk

ID stable de documentation : **ACR-028**.

Version publiée : [`appcore-sdk 1.0.0-rc.1`](https://crates.io/crates/appcore-sdk/1.0.0-rc.1).

`appcore-sdk` est la façade des applications. Il offre une petite surface
orientée manifestes tandis que les crates spécialisés gardent la responsabilité
du stockage, scheduling, sync, AI, documents et déploiement.

Il remplace `appcore-bin`, désormais retiré, sans conserver l'ancien host ni la
CLI Runtime.

:::warning Migration depuis appcore-bin
La dernière version de `appcore-bin` sur crates.io n'est qu'un avis de retrait.
Les nouvelles applications doivent dépendre directement de `appcore-sdk`. Les
applications existantes conservent leurs manifestes et leur code métier,
remplacent les imports `appcore_bin` et laissent providers, listeners, workers
et shutdown à l'exécutable de déploiement.
:::

## Quand l'utiliser

- pour démarrer une application AppCore externe à partir des trois artefacts ;
- pour implémenter `Application` et enregistrer commands, events, queries,
  decisions, states, handlers ou tasks ;
- pour employer les defaults locaux canoniques avant de fournir des manifests
  V1 explicites ;
- pour activer des namespaces de capabilities sans composer manuellement un
  host Runtime.

Il n'ouvre aucun listener implicitement, ne choisit pas de provider, ne résout
pas de secret et ne contrôle pas le lifecycle du processus. La composition du
déploiement reste explicite.

## Contrats principaux

- `run` et `App` fournissent le plus petit contexte local validé ;
- `Application` définit les hooks d'enregistrement appartenant à l'application ;
- `manifest` réexporte les contrats canoniques de manifest V1 ;
- les namespaces protégés par features exposent les contrats API, deployment,
  scheduler, storage, sync, AI et FileMaker ;
- `App::logging` configure le pipeline borné d'`appcore-log`.

Commencez par le [tutoriel](/fr/tutorials/first-application), le
[guide en anglais](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.en.md),
le [guide en portugais](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.pt.md)
ou le [guide en français](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.fr.md).
Exécutez ensuite l’[exemple de base](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/basic.fr.md)
et l’[exemple intermédiaire](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/intermediate.fr.md).
