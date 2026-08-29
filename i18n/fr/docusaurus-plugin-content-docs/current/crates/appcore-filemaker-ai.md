---
title: appcore-filemaker-ai — 0.1 alpha
---

# appcore-filemaker-ai

`appcore-filemaker-ai 0.1.0-alpha.1` est le bridge facultatif et borné entre les
outils `appcore-ai` et les sessions FileMaker déterministes. C'est un aperçu
source qui n'est pas publié sur crates.io.

Le bridge déclare 20 outils exacts, borne appels, patches et octets de résultat,
et applique la policy editable/locked du template avant toute mutation
atomique. Les requêtes ne changent pas la revision. Les outils d'artifact
renvoient du base64 borné en mémoire sans choisir de path filesystem.

Les dépendances AppCore directes sont `appcore-ai` et `appcore-filemaker`. Policy
et orchestration IA restent hors du compilateur déterministe.

Documentation maintenue par le crate : [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.fr.md),
[exemple de base](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.fr.md) et
[exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.fr.md).
