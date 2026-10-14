---
title: appcore-filemaker — 0.1 beta
---

# appcore-filemaker

> **BÊTA PUBLIQUE** — `0.1.0-beta.6` est publiée sur crates.io pour évaluation.

`appcore-filemaker 0.1.0-beta.6` est le compilateur déterministe officiel
d'AppCore pour documents déclaratifs, canvases vectoriels et datasets. La
version `0.1.0-beta.6` est publiée sur crates.io et reste hors du Runtime stable.

Pour découvrir le format, suivez le
[guide YAML pas à pas](./appcore-filemaker-yaml.md). Il part de l'en-tête
minimal puis couvre données, styles, vecteurs, tables, rôles de page, images,
collision, composants et preflight strict. Il se termine par la référence
complète des champs et distingue les nœuds réservés non encore implémentés.

Le YAML strict `filemaker: "1.0"`, les données typées et patches atomiques sont
compilés en IR. Polices et assets explicites sont mesurés avant layout
fixed-point, collision/reflow géométrique et construction de la
`ResolvedScene` immuable. Inspection, validation, preflight et export consomment
cette scène sans modifier la géométrie.

Canvas est un contrat de dessin sémantique, pas un tampon de pixels. Les
coordonnées acceptent `pt`, `px`, `mm`, `cm`, `in`, `%`, l'unité logique `lu`
et les valeurs `norm`/`normalized` bornées à `0..=1`. Text, image, line, rect,
circle, ellipse, polygon, path et group restent des nœuds typés ; les paths
conservent move, line, courbe cubique et close. Circle exige des axes résolus
égaux. Safe area, presets, layers/z-index, transforms et collision sont des
entrées explicites et orthogonales.

Les couleurs restent indépendantes du format en RGB, RGBA, Gray ou CMYK en
millionièmes. YAML accepte noms stables, hex, notation fonctionnelle entière et
couleurs typées avec tag explicite ; fonds fill, bordures stroke et opacity
restent séparés. `MemoryResolver` et `FileResolver` à racine canonique
implémentent la résolution bornée des assets, templates et polices.
`FontManager::register_from` enregistre une police logique exacte sous la
limite d'octets de l'appelant sans jamais parcourir les polices de l'hôte.
L'ordre explicite de fallback fait partie du fingerprint. SVG et HTML
incorporent les familles réellement choisies dans les glyph runs résolus, y
compris les cellules de table.

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
rendent les runs façonnés/tronqués. `writing_mode: vertical` implémente des
colonnes de haut en bas progressant de droite à gauche en PDF, SVG, PNG/JPEG et
HTML. L'emoji couleur reste une perte explicite jusqu'à son implémentation.

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
La planification des flux distribués compte les enfants visibles en deux passes
bornées, sans allouer de liste temporaire de références et en conservant le
même espacement.
Le fingerprint trie les références empruntées aux noms d'assets, évitant les
chaînes clonées pendant la résolution déterministe.

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

La résolution des couches parcourt paresseusement les éléments actifs de chaque
page physique ; la sélection par rôle n'alloue donc pas de liste temporaire de
références.

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

PDF éditable/flattened/hybride, SVG, PNG/JPEG et HTML sémantique/fixe rendent maintenant
directement ces fragments résolus. L'usage des polices PDF inclut chaque run de
cellule, SVG et HTML incluent les polices des styles data, et le raster trace les
mêmes glyphes façonnés. Le preflight valide structure de table, bornes des
cellules, diagnostics de texte et exigences de polices incorporées avant export.
Les éléments texte peuvent composer une ligne de style partagé avec
`text_segments`, des bindings de chaîne et des longueurs `gap_after` explicites.
Exigez `overflow: error` et `max_lines: 1` ; toutes les parties et espaces sont
mesurés ensemble avant alignement et partagés par PDF, SVG, raster et HTML.
Les runs PDF éditables utilisant une face Standard 14 enregistrée sont émis
comme opérations de texte PDF natives. Les largeurs et le crénage AFM continuent
de déterminer le layout ; le lecteur PDF applique les avances natives de la face.

Les sorties sont PDF éditable/flattened/hybride, SVG, PNG, JPEG, HTML sémantique/fixe,
CSV streaming et masques PNG/PDF/SVG/JSON. Les modes préparés échouent
explicitement ou figurent dans `ExportLossReport`.

Chaque format de document écrit vers un writer fourni par l'appelant et offre
aussi des octets bornés en mémoire ; le CSV de dataset streame ses lignes par
les deux mêmes interfaces. Le DPI ne concerne que PNG/JPEG et la qualité
uniquement JPEG. PNG
préserve la transparence, tandis que JPEG enregistre l'aplatissement alpha du
style ou de l'image avant une sortie stricte. Le HTML fixe ne déclare pas la
capacité sémantique. PDF émet des métadonnées déterministes de titre, creator et
producer ; le PDF éditable embarque les subsets exacts de glyphes et les maps
Unicode. PDF Hybrid peint des contours déterministes et ajoute un texte Unicode
invisible et subsetté aux coordonnées résolues des glyphes pour la recherche,
la sélection et l'extraction. Liens, bookmarks, accessibilité tagged, PDF/A,
WebP, XLSX, ZPL et ESC/POS restent des contrats préparés explicites.

La validation possède des étapes explicites de schéma, données typées, layout
résolu et preflight conscient de l'exporter. Les warnings bornés sont
first-class ; strict les rejette et la troncature du rapport échoue fermée. Le
preflight détecte les écarts binding, asset, glyphe, collision, overflow, DPI
effectif, vector/CMYK/alpha JPEG, police incorporée pour PDF editable/hybride et
accessibilité demandée.

Les fingerprints déterministes cadrent versions schéma et engine,
template/données/patches canoniques, digests des assets référencés et des
polices enregistrées. Les champs JSON canoniques utilisent une passe de
dimensionnement suivie d'un hachage SHA-256 direct sous le budget agrégé
`max_output_bytes`, en conservant le framing V1 sans retenir un buffer JSON
complet. `LayoutEngine::resolve_cached` ne résout qu'en cas de
miss du `SceneCache` borné, renvoie des scènes immuables partagées pour
render-many et rejette les anciennes versions d'engine.
Le batch ordonné complet de patches a une limite globale ; remove/replace
rejettent tout subtree cible contenant un descendant locked.

Le travail sur entrée hostile possède des bornes explicites. Le binding partage
un seul budget d'éléments entre racines, descendants et expansion des repeats,
avec annulation/progression coopérative aux frontières d'élément. Le layout a
un budget total de comparaisons spatiales en plus du reflow borné. Les lectures
filesystem sous racine canonique rejettent traversal et liens sortants, ouvrent
sans suivre un symlink/reparse point final substitué, appliquent la limite
d'octets et revalident le sandbox autour de la lecture. L'annulation d'export
précède toute sortie visible par l'appelant.

Les gates de fiabilité comprennent des snapshots exacts du SVG visuel et du
masque de collision, des properties de géométrie fixed-point et des cibles fuzz
séparées pour le pipeline YAML/bind/layout borné, l'Unicode arbitraire et les
textes trop grands, les assets raster corrompus, tailles absurdes/overlaps/
anchors circulaires et graphes d'include malformés, circulaires ou trop
profonds. Une entrée invalide peut échouer avec une erreur typée, mais ne doit
jamais provoquer panic, boucle infinie ou allocation sans borne explicite.

Le debug reste une couche dérivée en lecture seule. `DebugOverlay` fournit des
grilles bornées de 1/5/10/20 points, règles, coordonnées, IDs, bounds distincts,
anchors, régions résolues, géométrie safe/collision, exclusions et crosshairs
sans changer layout ni ordre de peinture. Les masques
collision/layout/visual/combined dérivent leurs rectangles occupés et libres
par vue et exportent PNG, PDF, SVG ou un JSON stable
occupied/free/collisions/overflow. `inspect` et `explain` conservent une trace
structurée des x/y/width/height source, anchors, région, mesure, policy de
collision, page/reflow et provenance.
Le JSON, le SVG et le PDF du masque comptent d'abord sous `max_output_bytes`
sans retenir la sortie, rejettent un résultat excessif avant de toucher la
destination, puis sérialisent directement dans le writer de l'appelant. PDF
émet des objets indépendants, un stream de commandes fixed-point de taille
exacte et son xref sans buffer de page ni de fichier complet.
`collision_mask_json_4m` mesure une sortie exacte de 4 188 826 octets ;
`collision_mask_pdf_100k` mesure 100 000 rectangles et un PDF exact de 1 800 626
octets avec checkpoints RSS idle, pic et retenu.

Le macrobenchmark `a4_report_export_matrix` mesure le pipeline A4 maintenu de
deux pages comme une opération bornée : décodage YAML et données typées, patch
runtime, mesure/layout/collision/reflow, preflight et neuf sorties streamées. Il
couvre PDF éditable, flattened et hybride ; SVG ; HTML sémantique et fixe ;
PNG ; JPEG avec pertes best-effort explicites ; et CSV du dataset. Trois
échantillons isolés du commit propre sur Apple M1 ont mesuré 70,56 ms p50,
71,34 ms p95, 0,22 ms de MAD et 10,64 Mio de RSS de pic.

Le core déterministe ne dépend pas de l'IA. `appcore-filemaker-ai` est un bridge
optionnel de 20 outils sur `appcore-ai`; `appcore-filemaker-cli` est l'adaptateur
processus borné. Exemples et preuves se trouvent sur la branche Runtime `beta`.

Export et preflight rejettent indépendamment les scènes résolues publiques
anciennes ou malformées et appliquent les budgets pages, éléments, paths,
lignes, texte et coordonnées avant toute écriture. Overlay diagnostique,
masque de collision/JSON et régions libres consomment aussi des limites
explicites de comparaisons et géométrie conservée. Les ID validés préservent
l'invariant du constructeur lors de la désérialisation.
Les exports contrôlés observent l'annulation et signalent la progression depuis
les vraies boucles d'éléments des renderers, avant d'écrire la sortie préparée à
l'appelant.
Le pipeline de polices explicites utilise `harfrust`, maintenu par le projet
HarfBuzz, pour le shaping et `skrifa`, de Google Fonts, pour validation,
métriques et outlines ; il ne découvre aucune police du système.
Une police valide sans capital height OS/2 utilise ascent comme policy PDF
`CapHeight` explicite et déterministe ; les advances absentes échouent.

Les exemples Rust exécutables conservent le document dans les fichiers séparés
[`basic.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/basic.yml)
et [`intermediate.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/intermediate.yml).
Les données typées restent dans des JSON correspondants séparés. Le lanceur de
base produit un SVG complet d'une page avec texte lié, dessins sémantiques,
sparkline et table stylée. L'intermédiaire produit un rapport confidentiel de
deux pages exactes avec numérotation, filigrane répété, graphiques vectoriels,
table paginée, preflight strict, PDF éditable, HTML fixe et aperçus SVG par
page. Tous deux enregistrent explicitement la police Noto Sans sous OFL fournie,
sans dépendre des polices hôte. Le code Rust n'intègre ni YAML ni JSON.

Documentation maintenue par le crate : [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/guide.fr.md),
[exemple de base](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/basic.fr.md) et
[exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/intermediate.fr.md).

## EAN et QR Code natifs

Ajouts disponibles dans `0.1.0-beta.6` : `type: barcode` sélectionne EAN-8 pour exactement
huit chiffres ASCII ou EAN-13 pour treize, via `text` ou `binding`. Les deux
vérifient la clé fournie, conservent les zéros initiaux et refusent les autres
longueurs, sans compléter ni réparer. `barcode::Ean8`, `Ean13` et `ean_shape`
exposent l'encodage. EAN-8 a 67 modules avec sept modules libres de chaque côté ;
EAN-13 en a 95, avec onze à gauche et sept à droite. Les chiffres lisibles restent
un texte séparé. Les suppléments de deux/cinq chiffres, UPC et GTIN-14 ne sont
pas pris en charge par cette API.

`type: qr` reçoit du texte UTF-8 littéral ou lié aux données.
`qrcode::QrCode::encode` produit un Model 2 normal avec correction moyenne,
mode octets et ECI UTF-8 explicite 26. La plus petite version suffisante est
sélectionnée. Les payloads doivent contenir 1–1024 octets UTF-8. Aucune URL n'est
consultée et le contenu n'est pas interprété. Une entrée vide/trop grande ou une
géométrie insuffisante échoue avant export ; erreurs et Debug omettent le payload.
Quatre modules libres entourent chaque côté. Le symbole carré est centré dans
une boîte rectangulaire sans déformation. Le layout compte les commandes
vectorielles dans le budget cumulatif `max_path_commands`, y compris les répétitions.

Les deux types deviennent des paths vectoriels au layout, partagés par PDF, SVG,
PNG/JPEG et HTML fixe/sémantique. Un `ResolvedElement` non préparé de kind `Qr`
ou `Barcode` n'a toujours pas d'exporter direct. Garder un fond clair libre, une
taille d'impression et un DPI adaptés ; tester l'imprimante/scanner réel.
L'encodage n'est pas une certification.

```yaml
filemaker: '1.0'
model: canvas
id: symbols
page: { width: 300pt, height: 230pt }
elements:
  - id: ean
    type: barcode
    x: 10pt
    y: 10pt
    width: 162pt
    height: 40pt
    text: '96385074'
    style: { fill: black }
  - id: qr
    type: qr
    x: 10pt
    y: 70pt
    width: 140pt
    height: 140pt
    text: 'https://example.org/local'
    style: { fill: black }
```

`tests/barcode_workflows.rs` vérifie les modules EAN-8/EAN-13 du PNG réel et
décode les QR PNG/JPEG avec un decoder indépendant, dont Unicode et la borne
1024 octets. Entrées invalides, champs inconnus et budgets de paths sont testés.
Le flux multipage de 80 lignes/240 éléments en PDF/SVG/HTML reste couvert. Cela
valide l'export générique, pas la parité avec un PDF commercial externe. YAML
possède le layout ; les adaptateurs fournissent données typées et appels d'export.

Références : [guide GS1](https://www.gs1.org/standards/barcodes/10-steps-to-barcode-your-product/english)
et [API de l'encodeur QR](https://docs.rs/qrcode/0.14.1/qrcode/struct.QrCode.html).

## Release publiée

`0.1.0-beta.6` — publié sur crates.io ; les versions précédentes restent immuables.

## Paquet publié

[`appcore-filemaker 0.1.0-beta.6`](https://crates.io/crates/appcore-filemaker/0.1.0-beta.6) · [docs.rs](https://docs.rs/appcore-filemaker/0.1.0-beta.6) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-filemaker).

## Prérelease indépendante — 2026-10-14

`0.1.0-beta.7`: modifications propres.

[crates.io](https://crates.io/crates/appcore-filemaker/0.1.0-beta.7) · [docs.rs](https://docs.rs/appcore-filemaker/0.1.0-beta.7)

Le frontend YAML remplace le parser non maintenu par un parsing en Rust sûr (`serde-saphyr`). Les modèles source/fixtures YAML V1 et les booléens YAML 1.2 sont préservés. Champs inconnus, aliases récursifs et documents multiples sont rejetés ; les erreurs omettent les extraits source. Limites : profondeur 64, 1 000 000 événements, 50 000 aliases/ancres et 64 MiB de texte scalaire agrégé, en plus des limites entrée/schema existantes. Aucun fallback vers l’ancien parser distribué.
