---
title: Ownership de la façade SDK
sidebar_position: 13
---

# Ownership de la façade SDK

La décision AC-023 précédente, qui réunissait application et host dans
`appcore-bin`, a été remplacée.

## Décision actuelle

`appcore-sdk` possède la façade applicative publique, les manifestes locaux
canoniques, le bridge d'enregistrement, le logging borné et les namespaces de
capabilities optionnels. `appcore-bin` est retiré du workspace Runtime.

Le SDK ne possède aucun host ni CLI Runtime implicite. Les exécutables de
déploiement gèrent providers, listeners, workers, signaux et shutdown. Le code
métier reste ainsi dans le [contrat des trois
artefacts](./three-artifact-contract) sans transformer le SDK en composition
root de processus.

Aucun alias de compatibilité ni second parser ne conserve `appcore_bin`. Les
applications existantes migrent directement vers
[`appcore-sdk`](/fr/crates/appcore-sdk).
