---
title: appcore-filemaker — 0.1 alpha
---

# appcore-filemaker

`appcore-filemaker 0.1.0-alpha.1` is the official AppCore deterministic
compiler for declarative documents, vector canvases, and datasets. It is in
source preview and has not been published to crates.io; publication is a
separate maintainer decision.

Strict `filemaker: "1.0"` YAML, typed data, and atomic patches compile to typed
IR. Explicit fonts and assets are measured before fixed-point layout,
geometry-first collision/reflow, and immutable `ResolvedScene` construction.
Inspection, validation, preflight, and the selected exporter consume that scene
without changing geometry.

Collision policy inherits in the explicit document → page → region → group →
element order. YAML accepts `collision: false`, and reflow queries the selected
measured layout, visual, or intrinsic bounds.

Fixed-point transforms support translation, integer-degree rotation, scale,
flip/mirror, and explicit origins. They compose through groups and the same
resolved matrix is consumed by PDF, SVG, PNG/JPEG, and HTML.

Text elements declare layout through `text_options`. Overflow supports `wrap`,
`shrink`, `ellipsis`, `clip`, `expand`, and `error`, with bounded `max_lines`,
absolute `min_font_size`, and fixed-point `line_height`. Measurement and
expansion happen before collision; clipping is resolved geometry; SVG and HTML
render the resolved shaped/truncated runs. Vertical writing and color emoji are
reported as explicit exporter losses until implemented.

Declarative geometry also crosses YAML and IR unchanged. `constraints` carries
minimum, preferred, maximum, and a fixed-point width/height aspect ratio;
`align_x` and `align_y` select start, center, or end in the active container.
Anchors target earlier element edges or named guides with
`guide:name[+offset]`. Contradictory coordinates, ranges, and ratios fail
explicitly. Runtime move/resize patches replace prior positional/sizing intent.

Vertical and horizontal flow containers support `start`, `center`, `end`,
`space_between`, `space_around`, and `space_evenly`. Non-start distribution
requires explicit, preferred, or aspect-derived primary sizes; ambiguous auto
measurement and overflow fail before collision.

Top-level named `exclusions` define non-painted, page-relative rectangles that
must remain inside the trim box. They repeat within the global geometry budget
and seed every physical page's spatial index before element placement. Optional
`group` and `collides_with` fields use the same symmetric collision contract as
elements, while the candidate's existing push/error/next-page/shrink policy
remains responsible for bounded reflow. Inspection, collision masks, and
free-region queries retain the resolved exclusion; scene exporters receive no
paint node for it.

Document pages can declare `master`, `first`, `continuation`, and `last`
layers, each split into collision-free `background`, `header`, and `footer`
bands. Master elements repeat on every physical page; one role layer is chosen
after bounded body pagination; and `{page}`/`{pages}` text is resolved only
after the final total is known. Components, styles, binding, patches,
inspection, and every scene exporter honor the same contract. Resolved elements
retain a `collidable` flag so overlays do not create false collisions, consume
free regions, or alter pagination.

Restartable `Dataset` streams can stop at the bounded auto-column sample
without scanning the remainder. Tables resolve fixed, sampled-auto, and
weighted-flex widths; paginate fixed or callback-measured rows with correct
first/repeating header capacity; retain group boundaries and conditional
styles; and emit checked integer/decimal/currency totals only on the final
page. Row, field, cell, expression, sample, and page limits fail closed.

Strict YAML now exposes that contract directly: a `type: table` element must
declare its columns and an array `binding`. Grouping, totals, conditional
styles, header repetition, and row sizing remain typed in `TableIr`; every
bound row must be an object. Template-specific row, field, and cell limits may
only tighten the compiler-wide resource limits.

Layout now turns each bounded table page into an immutable
`ResolvedTableFragment` on a physical scene page. Exact columns, repeated
headers, row and cell rectangles, data styles, group continuity, totals, and
shaped cell text are fixed before export. Continuations use the normal global
page and collision bounds; exporters do not measure or repaginate them.

Editable/flattened PDF, SVG, PNG/JPEG, and semantic/fixed HTML now render those
resolved fragments directly. PDF font usage includes every cell run, SVG and
HTML include data-style fonts, and raster output outlines the same shaped
glyphs. Preflight validates table structure, cell bounds, text diagnostics,
and embedded-font requirements before export.

Implemented outputs are editable/flattened PDF, SVG, PNG, JPEG, semantic/fixed
HTML, streaming CSV, and PNG/PDF/SVG/JSON debug masks. Prepared modes and nodes
fail explicitly or enter `ExportLossReport`; no silent fallback is allowed.

The deterministic core does not depend on AI. `appcore-filemaker-ai` is an
optional 20-tool bridge over `appcore-ai`; `appcore-filemaker-cli` is the
bounded process adapter. Source examples and exact alpha evidence live in the
Runtime repository on the `beta` branch.

Crate-owned documentation: [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/basic.en.md), and
[intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/intermediate.en.md).
