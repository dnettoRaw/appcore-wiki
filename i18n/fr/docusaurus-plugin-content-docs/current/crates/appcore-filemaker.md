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

Les couleurs restent indépendantes du format en RGB, RGBA, Gray ou CMYK en
millionièmes. YAML accepte noms stables, hex, notation fonctionnelle entière et
couleurs typées avec tag explicite ; fonds fill, bordures stroke et opacity
restent séparés. `MemoryResolver` et `FileResolver` à racine canonique
implémentent la résolution bornée des assets, templates et polices.
`FontManager::register_from` enregistre une police logique exacte sous la
limite d'octets de l'appelant sans jamais parcourir les polices de l'hôte.

La cascade complète est defaults → theme → template → style
component/nommé/inline développé → règles data conditionnelles ordonnées →
`SetStyle` runtime transactionnel → `ExportStyleOverride`. Le style runtime
change avant la mesure. La couche export expose seulement fill, stroke, opacity
et couleur texte ; elle ne peut invalider la géométrie résolue. Layer, z-index
et ordre source trient la peinture indépendamment de la collision géométrique.

Les métadonnées raster et SVG sont résolues avant export. `contain` et la
réduction `scale_down` conservent l'aspect en microunités fixed-point ; fill,
none intrinsèque, crop, cover focal et EXIF facultatif produisent des rectangles
source, destination et clip immuables. Preflight calcule le DPI raster effectif
après transform. SVG/HTML incorporent SVG ; PDF/raster signalent sa
rasterisation non prise en charge comme perte de fidélité explicite.

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

La géométrie déclarative traverse aussi YAML et IR sans modification.
`constraints` porte minimum, préféré, maximum et ratio largeur/hauteur
fixed-point ; `align_x` et `align_y` choisissent début, centre ou fin dans le
conteneur actif. Les anchors ciblent les bords d'éléments antérieurs ou des
guides nommés avec `guide:nom[+offset]`. Coordonnées, plages et ratios
contradictoires échouent explicitement. Les patches move/resize remplacent
l'intention de position/taille antérieure.

Les conteneurs flow verticaux et horizontaux acceptent `start`, `center`,
`end`, `space_between`, `space_around` et `space_evenly`. Toute distribution
autre que start exige une taille primaire explicite, préférée ou dérivée du
ratio ; mesure auto ambiguë et overflow échouent avant la collision.

Les `exclusions` nommées au niveau racine définissent des rectangles relatifs à
la page, non peints et obligatoirement contenus dans la trim box. Elles se
répètent dans le budget géométrique global et initialisent l'index spatial de
chaque page physique avant le placement des éléments. Les champs optionnels
`group` et `collides_with` utilisent le même contrat de collision symétrique que
les éléments, tandis que la politique push/error/next-page/shrink du candidat
reste responsable du reflow borné. Inspection, masques de collision et requêtes
de régions libres conservent l'exclusion résolue ; les exporters ne reçoivent
aucun node à peindre.

Les pages document peuvent déclarer des layers `master`, `first`,
`continuation` et `last`, chacune divisée en bandes `background`, `header` et
`footer` sans collision. Les éléments master se répètent sur chaque page
physique ; une layer de rôle est choisie après la pagination bornée du corps ;
et le texte `{page}`/`{pages}` n'est résolu qu'une fois le total final connu.
Composants, styles, binding, patches, inspection et tous les exporters de scène
respectent le même contrat. Les éléments résolus conservent un flag
`collidable` afin que les overlays ne créent pas de fausses collisions, ne
consomment pas les régions libres et ne modifient pas la pagination.

Les streams `Dataset` redémarrables s'arrêtent à l'échantillon borné de colonne
auto sans parcourir le reste. Les tables résolvent largeurs fixed, auto
échantillonnées et flex pondérées ; paginent lignes fixes ou mesurées par
callback avec capacité correcte du header initial/répété ; conservent limites
de groupe et styles conditionnels ; et émettent les totaux
integer/decimal/currency vérifiés uniquement sur la dernière page. Les limites
de ligne, field, cellule, expression, échantillon et page échouent fermées.

Le YAML strict expose désormais ce contrat directement : un élément
`type: table` doit déclarer ses colonnes et un `binding` vers un tableau.
Groupement, totaux, styles conditionnels, répétition du header et taille des
lignes restent typés dans `TableIr` ; chaque ligne liée doit être un object.
Les limites de lignes, fields et cellules propres au template peuvent seulement
réduire les limites globales de ressources du compilateur.

Le layout transforme maintenant chaque page de table bornée en
`ResolvedTableFragment` immuable sur une page physique de la scène. Colonnes
exactes, headers répétés, rectangles ligne/cellule, styles data, continuité de
groupe, totaux et texte façonné sont fixés avant export. Les continuations
respectent les bornes globales de pages et collision ; les exporters ne mesurent
ni ne repaginent.

PDF éditable/flattened, SVG, PNG/JPEG et HTML sémantique/fixe rendent maintenant
directement ces fragments résolus. L'usage des polices PDF inclut chaque run de
cellule, SVG et HTML incluent les polices des styles data, et le raster trace les
mêmes glyphes façonnés. Le preflight valide structure de table, bornes des
cellules, diagnostics de texte et exigences de polices incorporées avant export.

Les sorties sont PDF éditable/flattened, SVG, PNG, JPEG, HTML sémantique/fixe,
CSV streaming et masques PNG/PDF/SVG/JSON. Les modes préparés échouent
explicitement ou figurent dans `ExportLossReport`.

Le core déterministe ne dépend pas de l'IA. `appcore-filemaker-ai` est un bridge
optionnel de 20 outils sur `appcore-ai`; `appcore-filemaker-cli` est l'adaptateur
processus borné. Exemples et preuves se trouvent sur la branche Runtime `beta`.

Documentation maintenue par le crate : [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/guide.fr.md),
[exemple de base](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/basic.fr.md) et
[exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/intermediate.fr.md).
