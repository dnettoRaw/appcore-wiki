---
title: appcore-filemaker-cli — 0.1 alpha
---

# appcore-filemaker-cli

`appcore-filemaker-cli 0.1.0-alpha.1` est l'adaptateur de processus borné de
`appcore-filemaker`. C'est un aperçu source qui n'est pas publié sur crates.io.

La commande choisit le format d'export ; le YAML du template ne le choisit
jamais. `check`, `validate`, `preflight` et les commandes de diagnostic sont en
lecture seule, sauf artifacts de sortie explicites. `render` et `mask` publient
les fichiers atomiquement. `migrate` est réservé et échoue sans modifier
l'entrée. Les réponses JSON stables servent l'automatisation et les échecs
typés gardent des codes de sortie non nuls.

`schema --json` décrit couleurs typées, cascade de style exécutable, overrides
export limités à la peinture et ordre layer/z-index indépendant de la collision.

Les dépendances AppCore directes sont `appcore-args` et `appcore-filemaker`.

Documentation maintenue par le crate : [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/guide.fr.md),
[exemple de base](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/basic.fr.md) et
[exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/intermediate.fr.md).
