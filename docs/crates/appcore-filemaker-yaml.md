---
title: appcore-filemaker — step-by-step YAML guide
---

# Building a YAML document step by step

This guide teaches the strict `filemaker: "1.0"` template from an empty file.
Unknown fields, missing units, and invalid combinations fail instead of being
guessed. The YAML describes the document; typed data stays in separate JSON,
fonts and assets are registered explicitly, and the output format is selected
at export time.

## 1. Start with the smallest document

Save this as `report.yml`:

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

- `filemaker` selects the contract. V1 requires exactly `"1.0"`.
- `model` is `document`, `canvas`, or `dataset`.
- `id` is the stable logical template identifier.
- `page` defines the physical area.
- `elements` holds visual items in stable source order.
- Text requires a registered font; the host font catalog is never scanned.

Validate before rendering:

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

`check` validates the schema. `validate` also binds and resolves layout.
`render` writes the artifact. Run strict preflight for a production format.

## 2. Select page geometry

```yaml
page:
  preset: A4
  orientation: portrait
  margin: { top: 12mm, right: 12mm, bottom: 15mm, left: 12mm }
  safe: { top: 8mm, right: 8mm, bottom: 8mm, left: 8mm }
  bleed: { top: 3mm, right: 3mm, bottom: 3mm, left: 3mm }
  crop_marks: false
```

- `preset` selects a versioned known size. V1 includes A/B/C paper series,
  North American paper, screens, photos, envelopes, labels, thermal media, and
  social formats.
- `orientation` is `portrait` or `landscape`.
- `margin` reserves layout space.
- `safe` defines the safe inset.
- `bleed` extends outside trim.
- `crop_marks` requests marks from compatible exporters.
- Use `width` and `height` instead of `preset` for a custom size; do not mix
  both modes.

```yaml
page:
  width: 1920px
  height: 1080px
```

## 3. Use explicit units

| Form | Meaning |
|---|---|
| `12pt` | PostScript points |
| `20px` | logical 96-DPI pixels |
| `15mm`, `2.5cm`, `1in` | physical dimensions |
| `50%` | half of the container dimension |
| `0.5norm` | normalized spelling of 50% |
| `12lu` | caller-provided logical units |
| `auto` | automatic measurement where accepted |

Write `x: 20mm`, never an implicit `x: 20`.

## 4. Reuse themes, tokens, and styles

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

- `themes` declares named themes.
- `extends` inherits another theme without cycles.
- `tokens` provides `$name` values.
- `theme` chooses one active theme.
- top-level `style` applies to the complete template.
- `styles` declares named style fragments.
- element `styles: [title, card]` applies them in order.
- element `style` is its final static layer.

Every style field:

| Field | Purpose |
|---|---|
| `fill` | fill color |
| `stroke` | outline color |
| `stroke_width` | outline width |
| `opacity` | `0..1000000` opacity |
| `font` | registered logical font name |
| `font_size` | font size |
| `color` | text foreground |

Colors support stable names, hex, integer `rgb(...)`, `rgba(...)`, `gray(...)`,
millionth-channel `cmyk(...)`, and typed colors. `opacity: 240000` means 24%.

## 5. Control text measurement

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

`overflow` is `wrap`, `shrink`, `ellipsis`, `clip`, `expand`, or `error`.
`shrink` stops at `min_font_size`; `max_lines` is bounded; `line_height` is a
millionth multiplier. `writing_mode` is `horizontal` (the default) or
`vertical`. Vertical text wraps against the element height, shapes each column
top to bottom, and advances columns right to left. PDF, SVG, PNG/JPEG, and HTML
share the resolved columns and shaped runs without exporter-side reflow; PDF
and raster use the resolved glyph advances directly.

- `wrap` creates line breaks;
- `shrink` reduces text down to `min_font_size`;
- `ellipsis` ends overflowing text with an ellipsis;
- `clip` clips overflow and records a diagnostic;
- `expand` enlarges the measured box;
- `error` fails when the text does not fit.

## 6. Draw semantic vectors

```yaml
- { id: surface, type: rect, x: 20mm, y: 70mm, width: 70mm, height: 35mm, style: { fill: "#eef4f8" } }
- { id: status, type: circle, x: 25mm, y: 76mm, width: 20mm, height: 20mm, style: { fill: "#2a9d8f" } }
- { id: divider, type: line, x: 20mm, y: 112mm, width: 170mm, height: 0pt, style: { stroke: "#2e75b6", stroke_width: 1pt } }
```

Implemented element types:

| `type` | Specific use |
|---|---|
| `text` | explicitly shaped text |
| `image` | explicitly resolved image |
| `line` | straight line or path commands |
| `rect` | rectangle |
| `circle` | equal resolved width and height |
| `ellipse` | ellipse |
| `polygon` | closed polygon without curves |
| `path` | lines and cubic Bézier curves |
| `group` | child container |
| `table` | typed paginated table |

`chart`, `qr`, and `barcode` are reserved names, not implemented V1
capabilities. Compose charts from `rect`, `line`, `path`, and `text` today.

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

Path commands are `move`, `line`, `curve`, and `close`. A curve takes `x1`,
`y1`, `x2`, `y2`, `x`, and `y`.

## 7. Keep data separate

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

Types are `string`, `integer`, `decimal`, `boolean`, `date`, `date_time`,
`duration`, `currency`, `array`, `object`, and `null`. Add `nullable: true` when
null is valid. `computed` is deterministic and performs no IO.

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

- `binding` supplies the element's primary value.
- `when` controls visibility.
- `repeat` expands an element for each array item within configured limits.
- `style_rules` applies ordered conditional styles.

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

## 8. Use groups and flow layout

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

`layout` is `absolute`, `flow_vertical`, or `flow_horizontal`. `distribute` is
`start`, `center`, `end`, `space_between`, `space_around`, or `space_evenly`.
Non-start distribution requires explicit or preferred child sizes. `gap`
controls normal child spacing.

## 9. Build a paginated table

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

- `columns` fixes stable visual order.
- `fixed` is exact, `flex` shares remaining space, and `auto` measures a bounded
  sample.
- `repeat_header` repeats the header after pagination.
- `group_by` retains group continuity.
- `total_fields` emits checked exact totals only on the last page.
- `conditional_styles` evaluates against each row as `data`.
- `auto_sample_rows` bounds measurement.
- `max_rows`, `max_row_fields`, and `max_cell_bytes` may only tighten global
  limits.
- `row_height: auto` measures rows; an explicit size is more predictable.

## 10. Add page roles, numbering, and a watermark

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

- `master` appears on every page.
- `first` appears on the first page.
- `continuation` appears only on middle pages.
- `last` appears on the last page when the document has multiple pages.
- `{page}` and `{pages}` resolve after pagination.
- page layers do not collide with body content.
- `locked: true` rejects runtime patches for that node.

## 11. Resolve images explicitly

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

`fit` is `contain`, `cover`, `fill`, `none`, or `scale_down`. Focal and crop
values are parts per million from `0` to `1000000`. Supply the same bounded,
canonical-root resolver to layout and export. Traversal and escaping links fail.

## 12. Use guides, regions, anchors, and constraints

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

- `guides` are named positions.
- `regions` are named rectangles with an optional `collision` override.
- `region` selects the element's container.
- `anchors` reference a guide or earlier element edge with an optional offset.
- `constraints` accepts `min_width`, `preferred_width`, `max_width`,
  `min_height`, `preferred_height`, `max_height`, and millionth `aspect_ratio`.
- `align_x` and `align_y` are `start`, `center`, or `end`; do not combine
  alignment and an explicit coordinate on the same axis.

## 13. Apply transforms

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

Scale uses millionths. `mirror` is `none`, `horizontal`, `vertical`, or `both`.
The same resolved transform reaches every graphical exporter.

## 14. Configure collision and exclusions

Use the short form to opt out:

```yaml
collision: false
```

Or use the full declaration:

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

Policies are `push`, `error`, `overlay`, `next_page`, and `shrink`. Collision
inherits document → page → region → group → element.

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

An exclusion reserves repeated page-relative geometry without painting it.

## 15. Reuse components and includes

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

A component declares `props`, replaceable `slots`, and `elements`. An instance
uses `component`, `props`, and `slots`.

```yaml
includes:
  - path: fragments/header.yml
    namespace: report
```

Includes require a sandboxed resolver. `namespace` prevents ID collisions.
Included fragments cannot own physical page layers.

## 16. Carry optional AI bridge intent

```yaml
ai:
  purpose: "Maintain a bounded monthly report."
  rules:
    - "Preserve page numbering."
    - "Never remove the confidential watermark."
  editable: [report-title, results]
  locked: [confidential, page-number]
```

The deterministic core only retains this policy. The optional AI bridge may
interpret `purpose`, bounded `rules`, editable IDs, and locked IDs.

## Complete top-level field reference

| Field | Required | Purpose |
|---|---:|---|
| `filemaker` | yes | exact `"1.0"` version |
| `model` | yes | `document`, `canvas`, or `dataset` |
| `id` | yes | stable logical ID |
| `page` | no | geometry, edges, collision, and page layers |
| `collision` | no | inherited collision policy |
| `includes` | no | explicit fragments |
| `components` | no | reusable component declarations |
| `themes` | no | theme inheritance, tokens, and style |
| `theme` | no | active theme |
| `style` | no | template-wide style |
| `styles` | no | named styles |
| `guides` | no | named positions |
| `regions` | no | named rectangular containers |
| `exclusions` | no | non-painted reserved geometry |
| `data_schema` | no | typed data contract |
| `elements` | no | root elements in stable order |
| `ai` | no | external bridge intent |

`page` accepts `preset`, `width`, `height`, `orientation`, `margin`, `bleed`,
`safe`, `crop_marks`, `collision`, `master`, `first`, `continuation`, and
`last`. Every edge object accepts `top`, `right`, `bottom`, and `left`. Every
page role accepts `background`, `header`, and `footer` element lists.

## Complete element field reference

| Field | Purpose |
|---|---|
| `id` | unique safe 1–128-byte ASCII ID |
| `type` | element type |
| `component` | component to instantiate |
| `props` | instance properties |
| `slots` | named slot content |
| `x`, `y`, `width`, `height` | explicit-unit geometry |
| `constraints` | min/preferred/max size and aspect ratio |
| `align_x`, `align_y` | container alignment |
| `text` | literal text |
| `text_options` | overflow, lines, minimum size, writing |
| `table` | required options for `type: table` |
| `asset` | explicit image reference |
| `image` | fit, focus, crop, and EXIF options |
| `path` | semantic vector commands |
| `styles` | named style list |
| `style` | inline style |
| `style_rules` | ordered conditional styles |
| `transform` | translation, rotation, scale, flip, mirror, origin |
| `layout` | absolute or flow layout |
| `distribute` | flow child distribution |
| `gap` | distance between children |
| `binding` | primary data expression |
| `when` | visibility expression |
| `repeat` | array expansion expression |
| `anchors` | named placement anchors |
| `region` | containing region |
| `children` | nested elements |
| `locked` | reject runtime patches |
| `hidden` | initially hidden |
| `layer` | visual layer name |
| `z_index` | order inside the layer |
| `collision` | element collision override |

Fields are type-scoped: `text_options` works on `text`; tables accept only its
`min_font_size`, `line_height`, and `writing_mode` fields because table planning
owns cell overflow and line limits. `table` plus an array `binding` is required
on `table`; path commands only work on `line`, `path`, or `polygon`; tables
cannot contain children or slots.

## Recommended workflow

1. Start with version, model, ID, page, and one text element.
2. Run `check`.
3. Register the font and run `validate`.
4. Add `data_schema` and separate typed JSON.
5. Create tokens and named styles before repeating inline style.
6. Add groups and tables in small validated increments.
7. Use `inspect`, `explain`, and `debug` for surprising layout.
8. Run format-specific `preflight --strict`.
9. Render only after preflight is clean.

Use `appcore-filemaker schema --json` and
`appcore-filemaker capabilities --json` as executable truth for the installed
binary. Compare the runnable
[basic YAML](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/basic.yml)
and
[intermediate YAML](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/intermediate.yml).
