---
title: appcore-filemaker — 0.1 alpha
---

# appcore-filemaker

`appcore-filemaker 0.1.0-alpha.1` est le compilateur déterministe officiel
d'AppCore pour documents déclaratifs, canvases vectoriels et datasets. Il est
en aperçu source et n'est pas publié sur crates.io ; la publication reste une
décision séparée du mainteneur.

Le YAML strict `filemaker: "1.0"`, les données typées et patches atomiques sont
compilés en IR. Polices et assets explicites sont mesurés avant layout
fixed-point, collision/reflow géométrique et construction de la
`ResolvedScene` immuable. Inspection, validation, preflight et export consomment
cette scène sans modifier la géométrie.

La politique de collision hérite dans l'ordre explicite document → page →
région → groupe → élément. Le YAML accepte `collision: false`, et le reflow
interroge le bound mesuré sélectionné : layout, visuel ou intrinsèque.

Les transforms fixed-point prennent en charge translation, rotation en degrés
entiers, échelle, flip/mirror et origins explicites. Ils se composent dans les
groupes ; PDF, SVG, PNG/JPEG et HTML consomment la même matrice résolue.

Les éléments texte déclarent le layout via `text_options`. L'overflow accepte
`wrap`, `shrink`, `ellipsis`, `clip`, `expand` et `error`, avec `max_lines`
borné, `min_font_size` absolu et `line_height` fixed-point. Mesure et expansion
précèdent la collision ; le clipping est une géométrie résolue ; SVG et HTML
rendent les runs façonnés/tronqués. Écriture verticale et emoji couleur sont
des pertes explicites de l'exporter jusqu'à leur implémentation.

Les sorties sont PDF éditable/flattened, SVG, PNG, JPEG, HTML sémantique/fixe,
CSV streaming et masques PNG/PDF/SVG/JSON. Les modes préparés échouent
explicitement ou figurent dans `ExportLossReport`.

Le core déterministe ne dépend pas de l'IA. `appcore-filemaker-ai` est un bridge
optionnel de 20 outils sur `appcore-ai`; `appcore-filemaker-cli` est l'adaptateur
processus borné. Exemples et preuves se trouvent sur la branche Runtime `beta`.
