---
title: appcore-filemaker-cli — 0.1 alpha
---

# appcore-filemaker-cli

`appcore-filemaker-cli 0.1.0-alpha.1` est l'adaptateur de processus borné de
`appcore-filemaker`. C'est un aperçu source qui n'est pas publié sur crates.io.

La commande choisit le format d'export ; le YAML du template ne le choisit
jamais. `check`, `validate`, `preflight` et les commandes de diagnostic sont en
lecture seule, sauf artifacts de sortie explicites. `render` et `mask` publient
les fichiers atomiquement et rejettent une sortie résolue vers le template
d'entrée. `migrate` est réservé et échoue sans modifier l'entrée ; toute
mutation future exige flag et contrat explicites. Chaque commande fournit un
texte humain concis et un JSON stable pour l'automatisation.

`capabilities --json` publie la matrice stable : 0 succès, 2 validation, 64
usage, 65 données, 66 entrée absente, 69 indisponible, 70 software, 73 création
impossible, 74 I/O, 75 échec temporaire de ressource et 130 annulation.

`schema --json` décrit couleurs typées, cascade de style exécutable, unités de
coordonnées, primitives et commandes de path sémantiques Canvas, graphiques
avancés préparés, overrides export limités à la peinture et ordre layer/z-index
indépendant de la collision.

`debug TEMPLATE --grid 1|5|10|20 --view combined` émet l'overlay complet et non
mutant. `mask` exporte la géométrie collision/layout/visual/combined en PNG,
PDF, SVG ou JSON stable occupied/free/collisions/overflow. `inspect` et
`explain` exposent géométrie source, anchors, région, mesure, collision,
page/reflow et provenance conservées par la scène résolue.

`capabilities --json` sépare les formats implémentés des WebP, XLSX, ZPL,
ESC/POS, PDF/A, PDF Hybrid, liens, bookmarks et accessibilité tagged préparés.
`schema --json` déclare aussi les contrats writer/octets bornés, pertes
strict/best-effort, DPI raster uniquement, métadonnées PDF déterministes et
subsets de polices.

`check`, `validate` et `preflight` sont des frontières séparées de schéma,
layout résolu et exporter. Le JSON conserve warnings bornés et `truncated`
explicite ; strict rejette les warnings et la troncature échoue fermée. La
découverte du schéma liste aussi validation des données typées, entrées
complètes du fingerprint et cache immuable borné resolve-on-miss.

Les entrées template, données et polices sont lues via un seul handle ouvert et
s'arrêtent à `limit + 1` octets. Les commandes debug et mask transmettent les
mêmes limites core à la géométrie diagnostique bornée.

Les dépendances AppCore directes sont `appcore-args` et `appcore-filemaker`.

Les commandes documentées utilisent les entrées concrètes et séparées
[`basic.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/examples/basic.yml)
et [`intermediate.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/examples/intermediate.yml),
avec des données JSON typées pour le flux intermédiaire.

Documentation maintenue par le crate : [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/guide.fr.md),
[exemple de base](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/basic.fr.md) et
[exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/intermediate.fr.md).
