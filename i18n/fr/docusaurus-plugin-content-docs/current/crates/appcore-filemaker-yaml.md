---
title: appcore-filemaker — guide YAML pas à pas
---

# Créer un document YAML pas à pas

Ce guide part d'un fichier vide pour construire un template strict
`filemaker: "1.0"`. Un champ inconnu, une unité absente ou une combinaison
invalide échoue au lieu d'être devinée. Le YAML décrit le document ; les données
typées restent dans un JSON séparé, les polices et assets sont explicites et le
format de sortie est choisi lors de l'export.

## 1. Commencez par le plus petit document

Enregistrez `report.yml` :

```yaml
filemaker: "1.0"
model: document
id: my-first-report
page:
  preset: A4
elements:
  - id: title
    type: text
    text: "Hello, FileMaker"
    x: 20mm
    y: 20mm
    width: 170mm
    height: 12mm
    style:
      font: NotoSans
      font_size: 22pt
      color: "#17324d"
```

- `filemaker` sélectionne le contrat ; V1 exige exactement `"1.0"`.
- `model` vaut `document`, `canvas` ou `dataset`.
- `id` est l'identifiant logique stable.
- `page` définit la surface physique.
- `elements` contient les objets visuels dans un ordre stable.
- Tout texte exige une police enregistrée ; les polices hôte ne sont jamais
  découvertes automatiquement.

```bash
appcore-filemaker check report.yml --json
appcore-filemaker validate report.yml \
  --font NotoSans=./NotoSans-Regular.ttf \
  --json
appcore-filemaker render report.yml \
  --font NotoSans=./NotoSans-Regular.ttf \
  --format pdf \
  --output report.pdf
```

`check` valide le schéma. `validate` lie aussi les données et résout le layout.
`render` écrit l'artefact. Utilisez un preflight strict pour la sortie finale.

## 2. Choisissez la géométrie de page

```yaml
page:
  preset: A4
  orientation: portrait
  margin: { top: 12mm, right: 12mm, bottom: 15mm, left: 12mm }
  safe: { top: 8mm, right: 8mm, bottom: 8mm, left: 8mm }
  bleed: { top: 3mm, right: 3mm, bottom: 3mm, left: 3mm }
  crop_marks: false
```

- `preset` sélectionne une taille versionnée. V1 fournit les séries papier
  A/B/C, les formats nord-américains, écran, photo, enveloppe, étiquette,
  thermique et réseaux sociaux.
- `orientation` vaut `portrait` ou `landscape`.
- `margin` réserve le layout, `safe` définit la zone sûre et `bleed` la
  fond perdu.
- `crop_marks` demande les marques de coupe aux exporters compatibles.
- Pour une taille personnalisée, utilisez `width` et `height` à la place de
  `preset`, jamais avec lui.

```yaml
page:
  width: 1920px
  height: 1080px
```

## 3. Utilisez des unités explicites

| Forme | Signification |
|---|---|
| `12pt` | points PostScript |
| `20px` | pixels logiques à 96 DPI |
| `15mm`, `2.5cm`, `1in` | dimensions physiques |
| `50%` | moitié de la dimension du conteneur |
| `0.5norm` | forme normalisée de 50 % |
| `12lu` | unités logiques du contexte |
| `auto` | mesure automatique lorsqu'elle est permise |

Écrivez `x: 20mm`, jamais `x: 20` sans unité.

## 4. Réutilisez thèmes, tokens et styles

```yaml
themes:
  base:
    tokens:
      ink: "#17324d"
      accent: "#2e75b6"
      pale: "#eef4f8"
    style: { color: "$ink" }
  board:
    extends: base
theme: board

styles:
  title: { font: NotoSans, font_size: 24pt, color: "$ink" }
  card: { fill: "$pale", stroke: "$accent", stroke_width: 1pt }
```

- `themes` déclare des thèmes ; `extends` hérite sans cycle.
- `tokens` expose des valeurs `$nom`.
- `theme` active un thème.
- Le `style` racine s'applique au template entier.
- `styles` déclare des fragments nommés.
- `styles: [title, card]` sur un élément les applique dans l'ordre.
- Le `style` de l'élément est sa dernière couche statique.

Tous les champs de style :

| Champ | Rôle |
|---|---|
| `fill` | couleur de remplissage |
| `stroke` | couleur du contour |
| `stroke_width` | épaisseur du contour |
| `opacity` | opacité `0..1000000` |
| `font` | nom logique de police enregistré |
| `font_size` | taille de police |
| `color` | couleur du texte |

Les couleurs acceptent noms stables, hex, `rgb(...)`, `rgba(...)`, `gray(...)`,
`cmyk(...)` en millionièmes et couleurs typées. `opacity: 240000` signifie 24 %.

## 5. Contrôlez la mesure du texte

```yaml
- id: summary
  type: text
  text: "A bounded operational summary"
  x: 20mm
  y: 40mm
  width: 100mm
  height: 18mm
  styles: [title]
  text_options:
    overflow: shrink
    max_lines: 2
    min_font_size: 10pt
    line_height: 1200000
    writing_mode: horizontal
```

`overflow` vaut `wrap`, `shrink`, `ellipsis`, `clip`, `expand` ou `error`.
`shrink` s'arrête à `min_font_size`; `max_lines` est borné; `line_height` est
un multiplicateur en millionièmes. `writing_mode` vaut `horizontal` (par
défaut) ou `vertical`. Le texte vertical est coupé selon la hauteur, chaque
colonne est façonnée de haut en bas et les colonnes avancent de droite à gauche.
PDF, SVG, PNG/JPEG et HTML utilisent les mêmes colonnes et runs résolus sans
reflow ; PDF et raster utilisent directement les avances des glyphes.

## 6. Dessinez des vecteurs sémantiques

```yaml
- { id: surface, type: rect, x: 20mm, y: 70mm, width: 70mm, height: 35mm, style: { fill: "#eef4f8" } }
- { id: status, type: circle, x: 25mm, y: 76mm, width: 20mm, height: 20mm, style: { fill: "#2a9d8f" } }
- { id: divider, type: line, x: 20mm, y: 112mm, width: 170mm, height: 0pt, style: { stroke: "#2e75b6", stroke_width: 1pt } }
```

| `type` implémenté | Usage |
|---|---|
| `text` | texte façonné avec police explicite |
| `image` | image résolue explicitement |
| `line` | ligne droite ou commandes path |
| `rect` | rectangle |
| `circle` | largeur et hauteur résolues identiques |
| `ellipse` | ellipse |
| `polygon` | polygone fermé sans courbes |
| `path` | lignes et courbes de Bézier cubiques |
| `group` | conteneur d'enfants |
| `table` | table typée et paginée |

`chart`, `qr` et `barcode` sont des noms réservés, pas des capacités V1
implémentées. Composez les graphiques avec `rect`, `line`, `path` et `text`.

```yaml
- id: trend
  type: path
  x: 105mm
  y: 70mm
  width: 80mm
  height: 35mm
  style: { stroke: "#f4a261", stroke_width: 2pt }
  path:
    - { command: move, x: 0%, y: 80% }
    - { command: line, x: 30%, y: 55% }
    - { command: curve, x1: 45%, y1: 70%, x2: 70%, y2: 10%, x: 100%, y: 20% }
```

Commandes : `move`, `line`, `curve`, `close`. Une courbe prend `x1`, `y1`,
`x2`, `y2`, `x`, `y`.

## 7. Séparez les données

```yaml
data_schema:
  report_title: { type: string }
  requests: { type: integer }
  target_met: { type: boolean }
  rows: { type: array }
  above_target:
    type: boolean
    computed: 'data.target_met == true'
```

Types : `string`, `integer`, `decimal`, `boolean`, `date`, `date_time`,
`duration`, `currency`, `array`, `object`, `null`. Ajoutez `nullable: true` si
null est valide. `computed` est déterministe et n'effectue aucun IO.

```yaml
- id: bound-title
  type: text
  binding: data.report_title
  x: 20mm
  y: 20mm
  width: 170mm
  height: 12mm
  styles: [title]

- id: success-badge
  type: rect
  when: data.target_met
  x: 160mm
  y: 20mm
  width: 30mm
  height: 10mm
```

- `binding` fournit la valeur principale.
- `when` contrôle la visibilité.
- `repeat` développe un élément pour chaque valeur d'un tableau borné.
- `style_rules` applique des styles conditionnels ordonnés.

```yaml
- id: repeated-row
  type: group
  repeat: data.rows
  children: []
```

```yaml
style_rules:
  - when: 'data.target_met == true'
    style: { fill: "#e4f4ec", color: "#1f7a4d" }
```

## 8. Utilisez groupes et flows

```yaml
- id: kpis
  type: group
  x: 20mm
  y: 55mm
  width: 170mm
  height: 35mm
  layout: flow_horizontal
  distribute: space_between
  gap: 5mm
  children:
    - { id: kpi-a, type: rect, width: 50mm, height: 30mm }
    - { id: kpi-b, type: rect, width: 50mm, height: 30mm }
    - { id: kpi-c, type: rect, width: 50mm, height: 30mm }
```

`layout` vaut `absolute`, `flow_vertical` ou `flow_horizontal`. `distribute`
vaut `start`, `center`, `end`, `space_between`, `space_around` ou
`space_evenly`. Une distribution autre que start exige des tailles enfants
explicites ou préférées. `gap` définit l'espacement normal.

## 9. Construisez une table paginée

```yaml
- id: results
  type: table
  binding: data.rows
  x: 15mm
  y: 120mm
  width: 180mm
  height: 150mm
  style: { font: NotoSans, font_size: 8pt, color: "#17324d" }
  table:
    columns:
      - { field: name, header: Name, width: { mode: flex, value: 2 } }
      - { field: amount, header: Amount, width: { mode: fixed, value: 30mm } }
      - { field: status, header: Status, width: { mode: auto } }
    repeat_header: true
    group_by: region
    total_fields: [amount]
    conditional_styles:
      - { when: 'data.status == "Watch"', style: { fill: "#fff2e8", color: "#8f4b17" } }
    auto_sample_rows: 8
    max_rows: 100
    max_row_fields: 12
    max_cell_bytes: 256
    header_height: 8mm
    row_height: 7mm
```

- `columns` fixe l'ordre visuel.
- `fixed` est exact, `flex` partage le reste et `auto` mesure un échantillon
  borné.
- `repeat_header` répète l'en-tête ; `group_by` maintient les groupes.
- `total_fields` émet les totaux exacts sur la dernière page seulement.
- `conditional_styles` évalue chaque ligne comme `data`.
- `auto_sample_rows` borne la mesure.
- `max_rows`, `max_row_fields`, `max_cell_bytes` peuvent seulement réduire les
  limites globales.
- `row_height: auto` mesure les lignes ; une valeur explicite est plus prévisible.

## 10. Ajoutez rôles de page, numérotation et filigrane

```yaml
page:
  preset: A4
  master:
    header:
      - { id: top-rail, type: rect, x: 0mm, y: 0mm, width: 100%, height: 7mm, style: { fill: "#17324d" }, locked: true }
    footer:
      - { id: page-number, type: text, text: "Page {page} of {pages}", x: 160mm, y: 285mm, width: 35mm, height: 5mm, style: { font: NotoSans, font_size: 8pt }, locked: true }
  first:
    footer:
      - id: confidential
        type: text
        text: "CONFIDENTIAL"
        x: 5mm
        y: 113mm
        width: 200mm
        height: 42mm
        style: { font: NotoSans, font_size: 78pt, color: "#8da3b5", opacity: 240000 }
        transform: { rotate: -32, origin_x: 50%, origin_y: 50% }
        locked: true
```

`master`, `first`, `continuation` et `last` acceptent chacun `background`,
`header`, `footer`. Master se répète ; les trois autres sont liés au rôle de la
page. `{page}` et `{pages}` sont résolus après pagination. Ces layers ne
collisionnent pas avec le corps. `locked: true` refuse les patches runtime.

## 11. Résolvez les images explicitement

```yaml
- id: hero
  type: image
  asset: images/hero.png
  x: 20mm
  y: 40mm
  width: 170mm
  height: 70mm
  image:
    fit: cover
    focal_x: 500000
    focal_y: 350000
    crop: { left: 0, top: 0, right: 0, bottom: 0 }
    respect_exif: true
```

`fit` vaut `contain`, `cover`, `fill`, `none`, `scale_down`. Foyer et crop sont
en parties par million de `0` à `1000000`. Fournissez le même resolver borné à
racine canonique au layout et à l'export ; traversal et liens sortants échouent.

## 12. Guides, regions, anchors et constraints

```yaml
guides:
  content-left: 15mm
regions:
  body: { x: 15mm, y: 25mm, width: 180mm, height: 245mm }
elements:
  - id: card
    type: rect
    region: body
    anchors: { left: "guide:content-left" }
    constraints:
      min_width: 40mm
      preferred_width: 60mm
      max_width: 90mm
      preferred_height: 30mm
      aspect_ratio: 2000000
    align_y: center
```

`guides` sont des positions nommées. `regions` sont des rectangles nommés avec
collision facultative. `region` choisit le conteneur. `anchors` vise un guide
ou le bord d'un élément antérieur, avec offset facultatif. Les constraints sont
`min_width`, `preferred_width`, `max_width`, `min_height`, `preferred_height`,
`max_height`, `aspect_ratio` en millionièmes. L'alignement vaut `start`,
`center`, `end` ; ne combinez pas alignement et coordonnée sur le même axe.

## 13. Appliquez un transform

```yaml
transform:
  translate_x: 2mm
  translate_y: 0mm
  rotate: -15
  scale_x: 1000000
  scale_y: 1000000
  flip_x: false
  flip_y: false
  mirror: none
  origin_x: 50%
  origin_y: 50%
```

L'échelle utilise les millionièmes. `mirror` vaut `none`, `horizontal`,
`vertical` ou `both`. Tous les exporters graphiques reçoivent le même transform.

## 14. Collision et exclusions

Utilisez la forme courte pour sortir du système :

```yaml
collision: false
```

Ou utilisez la déclaration complète :

```yaml
collision:
  enabled: true
  group: content
  collides_with: [content, exclusion]
  ignore: [decorative-line]
  priority: 10
  movable: true
  bounds: layout
  policy: push
```

Les policies sont `push`, `error`, `overlay`, `next_page`, `shrink`. L'héritage
est document → page → region → group → élément.

```yaml
exclusions:
  header-clearance:
    x: 0mm
    y: 0mm
    width: 100%
    height: 18mm
    group: exclusion
    collides_with: [content]
```

Une exclusion réserve une géométrie répétée sans la peindre.

## 15. Components et includes

```yaml
components:
  metric-card:
    props: { label: Metric }
    slots: { detail: [] }
    elements:
      - { id: surface, type: rect, x: 0mm, y: 0mm, width: 50mm, height: 25mm }
elements:
  - id: requests-card
    type: group
    component: metric-card
    props: { label: Requests }
```

Un component déclare `props`, `slots` remplaçables et `elements`. Une instance
utilise `component`, `props`, `slots`.

```yaml
includes:
  - path: fragments/header.yml
    namespace: report
```

Les includes exigent un resolver sandboxed. `namespace` évite les collisions
d'ID. Un fragment inclus ne peut posséder les layers physiques de page.

## 16. Intention facultative pour le bridge IA

```yaml
ai:
  purpose: "Maintain a bounded monthly report."
  rules:
    - "Preserve page numbering."
    - "Never remove the confidential watermark."
  editable: [report-title, results]
  locked: [confidential, page-number]
```

Le core déterministe conserve seulement cette policy. Le bridge optionnel peut
interpréter `purpose`, `rules`, les ID `editable` et les ID `locked`.

## Référence complète des champs racine

| Champ | Requis | Rôle |
|---|---:|---|
| `filemaker` | oui | version exacte `"1.0"` |
| `model` | oui | `document`, `canvas`, `dataset` |
| `id` | oui | ID logique stable |
| `page` | non | géométrie, bords, collision, layers |
| `collision` | non | policy de collision héritée |
| `includes` | non | fragments explicites |
| `components` | non | composants réutilisables |
| `themes` | non | héritage, tokens et style |
| `theme` | non | thème actif |
| `style` | non | style global |
| `styles` | non | styles nommés |
| `guides` | non | positions nommées |
| `regions` | non | conteneurs rectangulaires |
| `exclusions` | non | géométrie réservée non peinte |
| `data_schema` | non | contrat de données typées |
| `elements` | non | éléments racine ordonnés |
| `ai` | non | intention pour bridge externe |

`page` accepte `preset`, `width`, `height`, `orientation`, `margin`, `bleed`,
`safe`, `crop_marks`, `collision`, `master`, `first`, `continuation`, `last`.
Chaque objet de bord accepte `top`, `right`, `bottom`, `left`. Chaque rôle de
page accepte les listes `background`, `header`, `footer`.

## Référence complète des champs d'un élément

| Champ | Rôle |
|---|---|
| `id` | ID ASCII sûr unique de 1–128 octets |
| `type` | type de l'élément |
| `component` | component à instancier |
| `props` | propriétés de l'instance |
| `slots` | contenu des slots nommés |
| `x`, `y`, `width`, `height` | géométrie avec unités |
| `constraints` | tailles min/préférée/max et ratio |
| `align_x`, `align_y` | alignement dans le conteneur |
| `text` | texte littéral |
| `text_options` | overflow, lignes, minimum, écriture |
| `table` | options obligatoires d'une table |
| `asset` | référence image explicite |
| `image` | fit, focus, crop et EXIF |
| `path` | commandes vectorielles |
| `styles` | liste de styles nommés |
| `style` | style inline |
| `style_rules` | styles conditionnels ordonnés |
| `transform` | translation, rotation, échelle, miroir, origine |
| `layout` | layout absolute ou flow |
| `distribute` | distribution des enfants du flow |
| `gap` | distance entre les enfants |
| `binding` | expression data principale |
| `when` | expression de visibilité |
| `repeat` | expansion d'un tableau |
| `anchors` | anchors de placement nommés |
| `region` | region contenant l'élément |
| `children` | éléments imbriqués |
| `locked` | refuse les patches runtime |
| `hidden` | masqué initialement |
| `layer` | nom de la layer visuelle |
| `z_index` | ordre dans la layer |
| `collision` | override de collision |

Les champs sont liés au type : `text_options` s'applique à `text`; une table
n'accepte que `min_font_size`, `line_height` et `writing_mode`, car son planner
contrôle l'overflow et les limites de lignes des cellules. `table` et un
`binding` de tableau sont obligatoires pour `table`; `path` seulement sur
`line`, `path`, `polygon`; une table n'accepte ni children ni slots.

## Ordre de travail recommandé

1. Version, model, ID, page et un texte.
2. Exécutez `check`.
3. Enregistrez la police et exécutez `validate`.
4. Ajoutez `data_schema` et le JSON typé séparé.
5. Créez tokens et styles nommés avant de répéter le style inline.
6. Ajoutez groupes et tables par petits incréments validés.
7. Utilisez `inspect`, `explain`, `debug` pour comprendre le layout.
8. Exécutez `preflight --strict` pour le format final.
9. Rendez seulement lorsque le preflight est propre.

`appcore-filemaker schema --json` et
`appcore-filemaker capabilities --json` donnent la vérité exécutable du
binaire installé. Comparez le
[YAML de base](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/basic.yml)
et le
[YAML intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/intermediate.yml).
