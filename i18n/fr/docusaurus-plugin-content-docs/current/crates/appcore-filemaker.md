---
title: appcore-filemaker — RC
---

# appcore-filemaker

:::info Release candidate
Publié et vérifié au registre : **[`1.0.0-rc.2`](https://crates.io/crates/appcore-filemaker/1.0.0-rc.2)**, 2026-10-17. Sélectionner `=1.0.0-rc.2` explicitement. Les versions restent indépendantes ; ceci est une release candidate, sans certification de déploiement ou de matériel.
:::

La RC exacte ci-dessus comprend les changements documentés de layout, diagnostic et Unicode PDF. Les anciennes notes d’audit et de publication pendant le développement ci-dessous conservent leur contexte historique. La migration des applications externes reste distincte. Le miroir public préserve les octets du registre ; son inventaire généré est validé séparément.

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

## Audit du contenu variable (2026-10-17)

Audit du baseline publié (les défauts ci-dessous décrivent le paquet audité) : mesure, expand, flux, ancres,
groupes, audit/preflight et overlays existent déjà. La hauteur intrinsèque des
conteneurs et un corps de tableau distinct pour la dernière page n’existent pas.
Expand avec max_lines peut tronquer sans diagnostic ; next_page peut repartir
à y=0 malgré les marges ; l’audit n’applique pas toujours les exceptions de
groupes. Zéro perte d’export ne prouve pas la sûreté du layout. Corriger avant
de recommander une acceptation stricte. Le premier audit a exécuté 55 tests
existants et rendu des contrôles de 1/2/5/20 pages sans réorganisation ; cela
ne qualifie pas tout le corpus commercial. Dimensionnement opt-in et convergence
bornée de dernière page exigent contrats/migration explicites, en préservant V1.


Le code 1.0.0-rc.2 diagnostique désormais expand avec limite et conserve cet avertissement sur les fragments, inclut le padding des groupes, respecte le corps/région de continuation avec transformations du parent et partage les filtres de groupes/ignore/overlay avec l’audit. Champs publics, YAML V1, limites explicites et bandes sont préservés. Les conteneurs intrinsèques du corps ont désormais l’API opt-in ci-dessous ; les corps adaptatifs de table ont désormais un plan opt-in séparé ; ces corrections sont incluses dans 1.0.0-rc.2.

## Hauteur intrinsèque (opt-in, 1.0.0-rc.2)

Utiliser `LayoutEngine::resolve_intrinsic(&document)` au lieu de `resolve`
pour mesurer les éléments déclarant explicitement `height: auto` en YAML.
`resolve`, le parseur V1, les littéraux des structures publiques et les
politiques de dépassement à hauteur fixe conservent leur contrat. Aucune
nouvelle dépendance ni mesure manuelle côté application.

Le texte réutilise le shaping et la mesure existants avec la police enregistrée,
le style, la largeur, les marges internes et les avances de lignes effectifs.
Un flux horizontal prend la hauteur maximale ; un flux vertical additionne
les hauteurs et espacements. `constraints: {min_height: 14mm}` préserve le
format court. Flux et ancres reçoivent la boîte mesurée avant les collisions.
Le document d'entrée reste intact. Un contenu dépassant `max_height` échoue
avec son identifiant au lieu d'être coupé.

Cette première option accepte des largeurs définies et des flux du corps avec
distribution au début. Le texte automatique accepte `wrap`, `expand` ou
`error`, horizontal et sans `max_lines`. Déclarer une hauteur fixe pour `clip`,
`ellipsis` ou `shrink`. Les groupes automatiques sont indivisibles et doivent
tenir sur une page utile. Leurs enfants ne peuvent déclarer x/y, ancres,
région, transformations, alignement géométrique autre que début,
keep-with-next ou hauteur/contraintes de hauteur en pourcentage. Un texte
extensible enfant doit utiliser la hauteur automatique. Groupes absolus ou
distribués, écriture verticale, bandes de page automatiques, aspect ratio ou
preferred height sur un élément automatique et padding vertical en pourcentage
échouent explicitement, sans estimation circulaire implicite.

Le parcours vérifie l'annulation, les limites d'éléments/texte et une profondeur
maximale de 64 avant de cloner le document lié aux données. La mesure vérifie
l'annulation par élément ; le shaping d'un élément n'est pas préemptif. Copie
et mesure ajoutent du travail et de la mémoire, sans gain de performance promis.
Exécuter le preflight de layout sur la scène finale, y compris éléments fixes
et overlays. Ne pas réutiliser les clés de cache du layout ordinaire.

Exécuter `cargo run -p appcore-filemaker --example intrinsic_height --locked`.
`examples/intrinsic-height.yml` utilise des JSON court/long séparés, deux
colonnes, un texte aligné à droite et des ancres déplaçant titre et corps.
Résultats dans `target/filemaker-examples/`. Rust ne remplace aucune coordonnée
YAML. L'exemple exige des diagnostics de layout valides avant l'export PDF.

Migration : sélectionner la nouvelle méthode et déclarer les hauteurs auto et
minimales en YAML. Retour arrière : conserver le dessin original et `resolve`.
L'API Rust est additive, sans autre parseur/version YAML. Les réserves variables
de première/pages intermédiaires/dernière page de table utilisent désormais le plan adaptatif séparé ; les flux globaux arbitraires restent hors de ce contrat.

Dans une racine participant à la mesure intrinsèque, les groupes sont
structurels : les politiques de collision des descendants ignorent explicitement
les identifiants des ancêtres. Les collisions entre frères et avec les éléments
externes restent actives. La résolution ordinaire et les racines sans hauteur
automatique conservent leurs politiques.

Le défaut d’extraction des ligatures est corrigé dans la version 1.0.0-rc.2 : clusters complets et `/ActualText` contextuel conservent le texte logique. Vérifier séparément extraction et rendu.

## Pagination adaptative de table (opt-in, 1.0.0-rc.2)

`AdaptiveLayoutPlan::parse_yaml` lit un dessin YAML séparé et strict avec
`filemaker_layout: '1.0'`. Après le compile/bind V1 existant, appeler
`LayoutEngine::resolve_adaptive(&document, &plan)`. Cette API additive conserve
les littéraux des structures publiques, le parseur V1, `resolve` et
`resolve_intrinsic`. Aucune dépendance, règle métier ou format persistant ajouté.

Le plan sélectionne une table racine, les corps verticaux `first`,
`intermediate`, `last` et `single`, un bloc racine final `closing`, son espacement
et la politique obligatoire `oversized_group: error` ou `split_rows`. Offsets
et hauteurs sont relatifs à la boîte complète, à largeur constante. Tous les
corps doivent tenir dans cette boîte, elle-même dans la région utile de page.

Les corps déclarés précèdent la réserve de clôture. Sa hauteur visible réutilise
la mesure intrinsèque et les contraintes existantes. Hauteur et espacement
sont soustraits une seule fois de `single` ou `last`. Le paginateur existant
soustrait ensuite l'en-tête une seule fois. Une clôture masquée ne réserve ni
hauteur ni espacement. Les bandes décoratives conservent leur sémantique V1,
sans réserve implicite.

Le groupe en attente existant permet de reconnaître le groupe final. Seule sa
dernière ligne porte la différence entre capacité ordinaire et finale. Un
changement de page recalcule réserve et mesure sensible à la page au départ
suivant. Le fragment final est translaté vers le corps last/single ; les ancres
placent la clôture après son bord inférieur. Ce problème vertical restreint
ne nécessite ni estimation du nombre de pages ni point fixe global. Mesure de
groupes et échantillonnage des colonnes peuvent toujours revisiter les lignes ;
aucune garantie d'une seule lecture des données.

Les clés contiguës égales de `keep_together_by` restent ensemble quand groupe
et réserve finale tiennent sur une page de destination. `split_rows` sépare
les lignes si cette contrainte combinée dépasse la capacité ; `error` rejette.
Une ligne indivisible avec réserve trop haute échoue dans les deux cas. Un
groupe laissant la première page entièrement vide produit une erreur explicite,
sans page vide ni requalification implicite d'une continuation. Des données
vides peuvent produire en-tête et clôture si l'en-tête tient.

Limites explicites : une table racine visible commençant à la page physique
zéro ; un unique bloc final du corps ancré par `top: table-id.bottom+gap` ;
aucune transformation, région ou keep-with-next sur ces racines. La clôture
peut être un texte ou groupe de flux à hauteur automatique. Ses descendants
doivent tenir dans sa boîte mesurée sur la dernière page de table. Collision
incompatible ou croissance d'un texte fixe : erreur sans scène partielle.
Ne pas combiner `table.page_bodies`, `reserve_after` conditionnel ou
`total_fields` intégré avec ce propriétaire de réserve. Les totaux peuvent
être des données liées dans la clôture. Plusieurs tables, des largeurs finales
différentes ou un flux global dépendant des pages nécessitent un contrat
explicite ultérieur, sans inférence.

Les limites de taille, profondeur, éléments, lignes, pages et collisions restent
actives. Annulation vérifiée avant planification, pendant visite, mesure et
évaluation des réserves ; un shaping individuel n'est pas préemptif. L'index
spatial reste inchangé, sans gain de temps ou mémoire promis. Valider layout
et export séparément : réussite ou zéro perte déclarée ne prouve ni géométrie
ni fidélité du texte. Le défaut d’extraction des ligatures est corrigé dans la version 1.0.0-rc.2 : clusters complets et `/ActualText` contextuel conservent le texte logique. Vérifier séparément extraction et rendu.

Exécuter `cargo run -p appcore-filemaker --example adaptive_pagination --locked`.
`examples/adaptive-pagination.yml`, `adaptive-pagination-plan.yml` et les JSON
typés séparés génèrent 1/2/5/20 pages dans `target/filemaker-examples/`.
L'exemple exige audit de layout et preflight avant chaque PDF. La régression
de huit lignes passe de trois pages à deux avec une seule réserve finale ;
indices source uniques et ordonnés. Rust ne mesure pas le texte côté
application et ne remplace aucune coordonnée YAML.

Migration : garder le dessin original, déplacer les corps dans le plan,
retirer les réserves V1/par ligne concurrentes, déclarer l'ancre de clôture et
choisir la nouvelle méthode. Retour arrière : dessin et méthode d'origine ;
données et formats persistants inchangés. Inclus dans `1.0.0-rc.2` ;
l'application externe n'a pas migré.

`first_after: {element: title, gap: 8pt}` place facultativement le début de
`first` et `single` sous une boîte de layout déjà mesurée à la page physique
zéro. Leurs bords inférieurs déclarés sont conservés ; le début ne remonte
jamais au-dessus de l'offset initial. Ceci relie en-tête automatique à deux
colonnes et titre à la première région, sans calcul de coordonnées côté
application. La boîte complète de table peut recouvrir les boîtes précédentes
alors que le corps utile sélectionné les évite : déclarer leurs identifiants
dans `collision.ignore` local, comme dans `examples/adaptive-header.yml`.
Aucune désactivation globale des collisions. Cible non résolue, ultérieure,
sur une autre page ou corps initial épuisé : erreur explicite. Un jeu non vide
doit placer des lignes sur la première page ; un report initial ne laissant
que des titres est rejeté pour éviter un titre isolé.

Exécuter `cargo run -p appcore-filemaker --example adaptive_header --locked`
pour les en-têtes court/long. Le YAML et le plan communs utilisent des JSON
synthétiques séparés, avec audit de layout et preflight obligatoires. Les deux
exemples produisent ensemble six documents PDF pour vérification visuelle.

## Preuves de pagination bornées (ajout 1.0.0-rc.2)

Utiliser `LayoutEngine::diagnose_adaptive(&document, &plan, max_decisions)` à la
place de `resolve_adaptive` pour obtenir une explication. `AdaptiveLayoutReport`
expose `outcome()`, `decisions()` et `into_outcome()`. Consulter ou enregistrer les
décisions avant de propager le résultat : les preuves précédentes restent
disponibles en cas d’échec. Chaque appel possède ses propres enregistrements.
Les API et littéraux publics existants sont conservés ; la résolution normale
ne crée aucun collecteur.

Chaque `PaginationDecision` contient l’ID du tableau, la page physique candidate,
les ordinaux des lignes source (base zéro, intervalle inclusif), la règle réelle
et les hauteurs numériques. `capacity` déduit l’en-tête du tableau une seule fois ;
`used_height` inclut les lignes et réserves précédentes ;
`available_height = capacity - used_height` ;
`required_height = group_height + reserved_height`. `final_reservation` est déjà
incluse dans `reserved_height`, sans addition supplémentaire. Elle combine bloc
final et espacement avec la différence entre hauteurs de corps normal et final,
et ne représente donc pas seulement la hauteur du bloc final.

Règles : `fit`, `move_group`, `split_rows`, `move_row`, `skip_first_page`, `reject`.
Un déplacement décrit le candidat source ; le `fit` suivant utilise les mesures
et réserves de destination. Une décision de groupe trop grand évalue une page
de continuation vide, même si elle n’est jamais émise. Ces preuves d’exécution
ne constituent ni une liste de pages émises ni une garantie de succès.
La validation préalable peut échouer sans décisions ; la validation finale peut
conserver des décisions `fit` sans retourner de scène. Un dataset vide ne génère
pas de décisions de lignes. L’enum des règles est non exhaustif.

La limite explicite doit être comprise entre un et `ResourceLimits.max_elements`.
Son épuisement retourne `LimitExceeded` avec le préfixe conservé, sans troncature
silencieuse ni scène partielle. Aucun texte, payload ou valeur de regroupement
n’est enregistré : seulement IDs, ordinaux et géométrie. Le collecteur optionnel
utilise de courtes sections mutex et conserve les caractéristiques Send/Sync du
moteur ; il ajoute un coût d’allocation et de sérialisation. Annulation et limites
existantes de pages, lignes et mesures restent actives.

`cargo run -p appcore-filemaker --example adaptive_pagination --locked` écrit
`*-pagination.json`, `*-debug.json` et les `*-mask-*.svg` par page, avec les exemples
de 1/2/5/20 pages. Réutilise `DebugOverlay::build_bounded` (zone utile, régions,
boîtes de layout/intrinsèques/visuelles et ancres) et l’exporteur SVG existant de
`CollisionMask`. Le masque représente l’occupation géométrique ; `audit_layout`
applique les politiques effectives de chevauchement.
`SceneInspector::explain_layout` explique la géométrie finale ; `audit_layout`
identifie collisions et coupures avec leur géométrie. Continuer le preflight strict
et la revue du PDF rendu : zéro perte d’export ne prouve pas un layout sûr.
Les étiquettes d’overlay peuvent contenir des expressions source ; les vérifier
avant partage externe.

Rollback : revenir à `resolve_adaptive` et ne plus enregistrer ces sorties.
Aucun changement YAML, persistance, dépendance, index spatial ou consommateur.

`header_height` indique la réserve d’en-tête appliquée ; `body_height = capacity + header_height` expose le corps normal avant cette déduction.

## Corpus synthétique mixte et gate d’adoption du consommateur


Exécuter `cargo run -p appcore-filemaker --example variable_corpus --locked`.
Un dessin YAML et un plan adaptatif séparé reçoivent quatre datasets JSON typés
synthétiques. Les sorties `target/filemaker-examples/variable-corpus-*` incluent
PDF, scène, preflight strict, décisions, overlay et masques SVG.
Cet incrément corrige aussi la précédence de peinture des bandes dans le moteur existant. Aucune nouvelle dépendance, API publique, propriété sérialisée ou version publiée.

| Pages | Groupes | Lignes source |
|---|---|---|
| 1 | 3 | 9 |
| 2 | 12 | 36 |
| 5 | 40 | 120 |
| 20 | 190 | 570 |

Chaque groupe contient article, description variable et commentaire avec remise
détaillée. Les trois lignes partagent `keep_together_by` ; `oversized_group: error`
rejette explicitement une description dépassant une page. Le test vérifie le texte
logique après shaping et la hauteur mesurée des cellules, pas seulement les sources.
L’en-tête automatique à deux colonnes, le titre dépendant et le premier corps
partagent la mesure native. Trois taux de TVA, valeurs antérieures, remises,
totaux nets/fiscaux/finaux, conditions, signature et EAN-13 sont des données du
consommateur synthétique. FileMaker ne calcule pas les impôts et ne valide aucune
règle commerciale. Les totaux des fixtures sont cohérents, sans certification fiscale.

La première valeur antérieure est barrée par une ligne avec overlay local explicite.
Le filigrane de chaque page et le tampon initial utilisent les bandes existantes :
leur contrat de peinture sans collision rejette déjà un champ `collision` explicite.
La détection des collisions du corps reste active. Les ancres absentes doivent être
omises ou null, jamais des chaînes vides répétées. Les coordonnées X du corps sont
relatives à l’origine de la zone utile ; une régression vérifie que la barre reste
dans la cellule visée après cette translation. Il s’agissait d’une correction de
configuration de fixture, pas d’un défaut moteur ou de shaping.

Les tests vérifient ordre sans perte ni duplication, texte intégral, groupes
indivisibles, nombre de pages, géométrie de la barre et descendants de clôture
uniquement sur la dernière page, code et signature compris. `audit_layout` et
preflight strict sont exécutés. Les pages doivent aussi être rendues et inspectées :
zéro perte d’export ne valide pas le layout. Le défaut d’extraction des ligatures est corrigé dans la version 1.0.0-rc.2 : clusters complets et `/ActualText` contextuel conservent le texte logique. Vérifier séparément extraction et rendu. Les masques SVG montrent
l’occupation géométrique ; `audit_layout` applique les chevauchements intentionnels.


L’adoption exige une nouvelle RC exacte publiée au registry ; aucun patch local ou changement du consommateur externe.

Reproduire les vérifications après l’exemple : `python3 crates/appcore-filemaker/wiki/audit/verify-variable-corpus.py`. Nécessite Poppler, vérifie IDs ordonnés, lignes de totaux fournies, 95 modules EAN-13 rendus et zones de silence, puis rend les 28 pages. Ne remplace ni revue visuelle ni certification scanner.

Le filigrane appartient à `page.master.background`. `z_index` ordonne la peinture dans une couche ; une valeur négative dans `header` ne place pas le filigrane derrière les glyphes du corps. La régression a d’abord échoué avec la bande d’en-tête, puis vérifie couche de fond et ordre de peinture. Le preflight strict acceptait la configuration masquant le texte.

Le corpus a aussi révélé un défaut moteur : le tri lexical plaçait la couche vide du corps avant `!page-background`, et des noms Unicode pouvaient dépasser la bande de premier plan. La correction compatible donne une précédence explicite aux bandes : fond, corps, en-têtes/pieds. Les noms des couches du corps gardent leur ordre lexical, puis z-index et séquence. Les tests couvrent couches vides/personnalisées/Unicode, z-index extrêmes et pixels raster réels. Aucun remplacement d’index spatial ni nouvelle API.

## Texte Unicode intégral dans les PDF (correction 1.0.0-rc.2)

L’export Editable et Hybrid associe chaque cluster à un seul glyphe à sa séquence
UTF-8 logique complète dans `ToUnicode`, au lieu du premier caractère seulement.
Le writer PDF existant produit les destinations UTF-16, paires de substitution
comprises. Les limites suivent les offsets logiques triés en octets, indépendamment
de l’ordre visuel RTL. Les frontières UTF-8 invalides et offsets terminaux ou hors
texte retournent `ExportUnsupported`, sans omission silencieuse de mappage.

Un glyphe peut représenter `fi` et le caractère littéral `ﬁ`, ou du texte composé
et décomposé. Un seul mappage par police ne représente pas toutes les occurrences.
Les runs ambigus ou clusters à plusieurs glyphes conservent le texte logique
original dans des spans PDF `/ActualText`. Le texte entier d’un cluster n’est pas
répété pour chacun de ses glyphes. Aucune normalisation Unicode n’est appliquée.
Les lecteurs de ces cas contextuels doivent respecter `/ActualText`.

PDF 1.7, polices, IDs, avances et géométrie sont conservés. Aucune nouvelle
dépendance, propriété publique, option YAML ou API. Standard 14 WinAnsi garde
son parcours existant. Flattened produit toujours des contours sans texte
recherchable. La correction concerne le mappage d’export et conserve layout,
shaping, politiques de coupure et positionnement bidi. Les extracteurs RTL peuvent
retourner l’ordre visuel avec contrôles directionnels ; l’exemple vérifie sa
séquence complète sans diacritiques en ordre logique ou visuel.

Les chaînes des CMaps partagent le budget explicite
`ResourceLimits.max_output_bytes`, vérifié avant allocation. L’index temporaire
des clusters est linéaire dans le nombre borné de glyphes ; tri et recherche
ajoutent du travail sans refaire le shaping. Les limites de scène, texte et sortie
restent actives, sans promesse de RSS constant ou de gain de vitesse.

Exécuter `cargo run -p appcore-filemaker --example pdf_unicode --locked` pour créer
les échantillons Editable, Hybrid et Flattened : `fi/fl/ffi/ffl`, mots courants,
ligatures littérales, accents composés/décomposés, cluster isolé à plusieurs glyphes
avec sa propre ressource de police et clusters arabes.

Puis exécuter
`python3 crates/appcore-filemaker/wiki/audit/verify-pdf-unicode.py`.
Nécessite Poppler, rend chaque mode, compare les scalaires latins exacts sans
normalisation NFC/NFKC, vérifie l’exemple RTL et l’absence de texte Flattened,
puis compare les pixels Hybrid/Flattened. Audit, preflight, extraction et revue
visuelle restent des vérifications distinctes.

Le vérificateur du corpus mixte contrôle maintenant tous les textes des éléments
et cellules, en plus des IDs et totaux. Les PDF existants doivent être réexportés.
Un consommateur registry reçoit cette correction via une nouvelle RC exacte publiée
et qualifiée. Aucune publication de paquet, déploiement wiki ou migration externe.
Le rollback sélectionne explicitement la release qualifiée précédente de l’exporteur.
