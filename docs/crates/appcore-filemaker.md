---
title: appcore-filemaker — 0.1 beta
---

# appcore-filemaker

> **PUBLIC BETA** — `0.1.0-beta.6` is available on crates.io for evaluation.

`appcore-filemaker 0.1.0-beta.6` is the official AppCore deterministic
compiler for declarative documents, vector canvases, and datasets. The
`0.1.0-beta.6` release is published on crates.io and remains outside the stable
Runtime graph.

New to the template format? Follow the
[step-by-step YAML guide](./appcore-filemaker-yaml.md) to build a document from
the minimum header through data, styles, vectors, tables, page roles, images,
collision, components, and strict preflight. It also contains a complete field
reference and marks reserved nodes that are not implemented yet.

Strict `filemaker: "1.0"` YAML, typed data, and atomic patches compile to typed
IR. Explicit fonts and assets are measured before fixed-point layout,
geometry-first collision/reflow, and immutable `ResolvedScene` construction.
Inspection, validation, preflight, and the selected exporter consume that scene
without changing geometry.

Canvas is a semantic drawing contract rather than a pixel buffer. Coordinates
accept `pt`, `px`, `mm`, `cm`, `in`, `%`, logical `lu`, and bounded `0..=1`
`norm`/`normalized` values. Text, image, line, rect, circle, ellipse, polygon,
path, and group remain typed nodes; paths retain move, line, cubic curve, and
close commands. Circles require equal resolved axes. Safe areas, presets,
layers/z-index, transforms, and collision are explicit orthogonal inputs.

Colors stay format-neutral as RGB, RGBA, Gray, or millionth-channel CMYK. YAML
accepts stable names, hex, integer functional notation, and explicitly tagged
typed colors; fill backgrounds, stroke borders, and opacity remain separate.
`MemoryResolver` and canonical-root `FileResolver` implement bounded asset,
template, and font lookup. `FontManager::register_from` registers an exact
logical font under the caller's byte cap and never scans host fonts.
The ordered fallback list is part of the fingerprint. SVG and HTML embed the
families actually selected in resolved glyph runs, including table cells.

The complete cascade is defaults → theme → template → expanded
component/named/inline style → ordered conditional data rules → transactional
runtime `SetStyle` → `ExportStyleOverride`. Runtime style changes occur before
measurement. The export layer exposes only fill, stroke, opacity, and text
color, so it cannot invalidate resolved geometry. Layer, z-index, and source
order sort painting independently from geometry-first collision placement.

Raster and SVG metadata resolve before export. `contain` and reducing
`scale_down` preserve aspect in fixed-point microunits; fill, intrinsic-size
none, crop, focal cover, and optional EXIF orientation yield immutable source,
destination, and clip rectangles. Preflight computes effective raster DPI from
the transformed destination. SVG/HTML embed SVG assets; PDF/raster report the
currently unsupported SVG rasterization as an explicit fidelity loss.

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
render the resolved shaped/truncated runs. `writing_mode: vertical` implements
top-to-bottom columns flowing right to left across PDF, SVG, PNG/JPEG, and HTML.
Color emoji remains an explicit exporter loss until implemented.

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
Distributed flow planning counts visible children in two bounded passes without
allocating a temporary reference list, preserving the same spacing results.
Fingerprinting sorts borrowed asset-name references, avoiding cloned strings
during deterministic asset resolution.

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
Page-layer resolution traverses active elements lazily per physical page, so
role selection does not allocate a temporary reference list.

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

Editable/flattened/hybrid PDF, SVG, PNG/JPEG, and semantic/fixed HTML now render those
resolved fragments directly. PDF font usage includes every cell run, SVG and
HTML include data-style fonts, and raster output outlines the same shaped
glyphs. Preflight validates table structure, cell bounds, text diagnostics,
and embedded-font requirements before export.
Text elements may compose one same-style line declaratively with ordered
`text_segments`, string bindings, and explicit `gap_after` lengths. Require
`overflow: error` and `max_lines: 1`; all pieces and gaps are measured together
before alignment. The shared layout is consumed by PDF, SVG, raster, and HTML.
Editable PDF runs using a registered Standard 14 face are emitted as native
PDF text-show operations. AFM widths and kerning continue to determine layout;
the PDF reader applies the face's native string advances while painting.

Implemented outputs are editable/flattened/hybrid PDF, SVG, PNG, JPEG, semantic/fixed
HTML, streaming CSV, and PNG/PDF/SVG/JSON debug masks. Prepared modes and nodes
fail explicitly or enter `ExportLossReport`; no silent fallback is allowed.

Every document format writes to a caller-owned writer and also offers bounded
in-memory bytes; dataset CSV streams rows through the same two interfaces. DPI
applies only to PNG/JPEG and quality only to JPEG. PNG preserves transparency,
while JPEG
records style or image-alpha flattening before strict output. Fixed HTML does
not advertise semantic capability. PDF emits deterministic title, creator, and
producer metadata; editable PDF embeds exact glyph subsets and Unicode maps.
Hybrid PDF paints deterministic outlines and adds invisible subsetted Unicode
text at the resolved glyph coordinates for search, selection, and extraction.
Links, bookmarks, tagged accessibility, PDF/A, WebP, XLSX, ZPL, and ESC/POS
remain explicit prepared contracts.

Validation has explicit schema, typed-data, resolved-layout, and
exporter-aware preflight stages. Bounded warnings are first-class; strict mode
rejects them and report truncation fails closed. Preflight detects binding,
asset, glyph, collision, overflow, effective-DPI, vector/CMYK/JPEG-alpha,
embedded-font requirements for editable/hybrid PDF, and requested-accessibility gaps.

Deterministic fingerprints frame schema and engine versions, canonical
template/data/patches, referenced asset digests, and registered font digests.
Canonical JSON fields use a sizing pass followed by direct SHA-256 hashing
under the aggregate `max_output_bytes` budget, preserving the V1 framing
without retaining a complete JSON buffer.
`LayoutEngine::resolve_cached` resolves only on a bounded `SceneCache` miss,
returns immutable shared scenes for render-many, and rejects stale engine
versions.
The complete ordered patch batch is globally bounded, and remove/replace
operations reject a target subtree containing any locked descendant.

Hostile-input work is bounded explicitly. Binding shares one element budget
across roots, descendants, and repeat expansion and checks cooperative
cancellation/progress at element boundaries. Layout has a total spatial
comparison budget in addition to bounded reflow. Canonical-root filesystem
reads reject traversal and escaping links, open without following a substituted
final symlink/reparse point, enforce the caller's byte cap, and revalidate the
sandbox path around the read. Export cancellation occurs before caller-visible
output.

Reliability gates include exact SVG visual and collision-mask snapshots,
fixed-point geometry property tests, and separate fuzz targets for the bounded
YAML/bind/layout pipeline, arbitrary Unicode and oversized text, corrupt raster
assets, absurd sizes/overlaps/circular anchors, and malformed, circular, or
over-depth include graphs. Invalid input may fail with a typed error but must
not panic, loop forever, or allocate without an explicit bound.

Debugging remains a derived read-only layer. `DebugOverlay` provides bounded
1/5/10/20-point grids, rulers, coordinates, IDs, distinct bounds, anchors,
resolved regions, safe/collision geometry, exclusions, and crosshairs without
changing scene layout or paint order. Collision/layout/visual/combined masks
derive view-specific occupied and free rectangles and export PNG, PDF, SVG, or
stable occupied/free/collisions/overflow JSON. `inspect` and `explain` retain a
structured trace of source x/y/width/height, anchors, region, measurement,
collision policy, page/reflow, and provenance.
Mask JSON, SVG, and PDF first count under `max_output_bytes` without retaining
the output, reject an oversized result before touching the destination, and then
serialize directly to the caller's writer. PDF emits independent objects, an
exact-length fixed-point command stream, and its xref without a page or complete
file buffer. `collision_mask_json_4m` measures an exact 4,188,826-byte output;
`collision_mask_pdf_100k` measures 100,000 rectangles and an exact
1,800,626-byte PDF with idle, peak, and retained RSS checkpoints.

The `a4_report_export_matrix` macrobenchmark measures the maintained two-page
A4 pipeline as one bounded operation: YAML and typed-data decoding, runtime
patch, measurement/layout/collision/reflow, preflight, and nine streamed
outputs. It covers editable, flattened, and hybrid PDF; SVG; semantic and fixed
HTML; PNG; JPEG with explicit best-effort losses; and dataset CSV. Three
isolated clean-commit Apple M1 samples measured 70.56 ms p50, 71.34 ms p95,
0.22 ms MAD, and 10.64 MiB peak RSS.

The deterministic core does not depend on AI. `appcore-filemaker-ai` is an
optional 20-tool bridge over `appcore-ai`; `appcore-filemaker-cli` is the
bounded process adapter. Source examples and exact alpha evidence live in the
Runtime repository on the `beta` branch.

Export and preflight independently reject stale or malformed public resolved
scenes and enforce page, element, path, row, text, and coordinate budgets before
writing. Diagnostic overlay, collision-mask/JSON, and free-region operations
also consume explicit comparison and retained-geometry limits. Validated IDs
retain their constructor invariant when deserialized.
Controlled exports observe cancellation and report progress from the actual
renderer element loops, before staged output is written to the caller.
The explicit-font pipeline uses maintained HarfBuzz-project `harfrust` for
shaping and Google Fonts `skrifa` for validation, metrics, and outlines; it
does not discover fonts from the operating system.
A valid font without OS/2 capital height uses ascent as the explicit,
deterministic PDF `CapHeight` descriptor policy; missing glyph advances fail.

Runnable Rust examples keep document input in separate
[`basic.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/basic.yml)
and [`intermediate.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/intermediate.yml)
files, with typed input in matching separate JSON files. The basic runner emits
a complete one-page SVG with bound text, semantic drawings, a sparkline, and a
styled table. The intermediate runner emits an exactly two-page confidential
report with numbering, repeated watermark, vector charts, paginated table,
strict preflight, editable PDF, fixed HTML, and per-page SVG previews. Both
runners register the bundled OFL Noto Sans font explicitly instead of depending
on host fonts. Their Rust source embeds neither YAML nor JSON.

Crate-owned documentation: [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/basic.en.md), and
[intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/intermediate.en.md).

## Native EAN and QR Code

Additions available in `0.1.0-beta.6`: `type: barcode` selects EAN-8 for exactly eight
ASCII digits or EAN-13 for exactly thirteen, from `text` or `binding`. Both
verify the supplied check digit, retain leading zeroes and reject other lengths;
no padding or repair. `barcode::Ean8`, `Ean13` and `ean_shape` expose the encoding.
EAN-8 has 67 symbol modules with seven clear modules on each side; EAN-13 has
95 with eleven left and seven right. Human-readable digits use a separate text
node. Two/five-digit supplements, UPC and GTIN-14 are not supported by this API.

`type: qr` takes literal or bound UTF-8 text. `qrcode::QrCode::encode` creates a
normal Model 2 symbol with medium error correction, byte mode and explicit UTF-8
ECI 26. It chooses the smallest fitting version. Payloads must contain 1–1024
UTF-8 bytes. No URL is fetched or content interpreted. Empty/oversized input and
unresolvable geometry fail before export; errors and symbol Debug omit payloads.
Four clear modules surround each side. A square symbol is centered in a
rectangular box without stretching. Layout charges generated vector commands
against the cumulative `max_path_commands` budget, including repeated symbols.

Both types become vector paths during layout, shared by PDF, SVG, PNG/JPEG and
fixed/semantic HTML. An unprepared `ResolvedElement` with kind `Qr` or `Barcode`
still has no direct exporter. Keep a clear light background, adequate print size
and raster DPI; test your actual printer/scanner. Encoding is not certification.

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

`tests/barcode_workflows.rs` checks actual EAN-8/EAN-13 PNG modules and independently
decodes exported QR PNG/JPEG, including Unicode and the 1024-byte boundary. It
also checks invalid inputs, strict unknown-field rejection and path budgets.
The existing 80-line/240-row multipage PDF/SVG/HTML workflow remains covered.
This validates generic export behavior, not external commercial PDF parity.
YAML owns layout; application adapters supply typed data and export calls.

Encoding references: [GS1 barcode guidance](https://www.gs1.org/standards/barcodes/10-steps-to-barcode-your-product/english)
and [QR encoder API](https://docs.rs/qrcode/0.14.1/qrcode/struct.QrCode.html).

## Published release

`0.1.0-beta.6` — published on crates.io; previously published versions remain immutable.

## Published package

[`appcore-filemaker 0.1.0-beta.6`](https://crates.io/crates/appcore-filemaker/0.1.0-beta.6) · [docs.rs](https://docs.rs/appcore-filemaker/0.1.0-beta.6) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-filemaker).

## Independent prerelease — 2026-10-14

`0.1.0-beta.7`: source changes.

[crates.io](https://crates.io/crates/appcore-filemaker/0.1.0-beta.7) · [docs.rs](https://docs.rs/appcore-filemaker/0.1.0-beta.7)

The YAML frontend replaces the unmaintained parser with safe Rust parsing (`serde-saphyr`). YAML V1 fixture/source models and YAML 1.2 boolean semantics are preserved. Unknown fields, recursive aliases and multiple documents fail closed; error messages omit source snippets. Parser budgets cap nesting at 64, events at 1,000,000, aliases/anchors at 50,000 and aggregate scalar bytes at 64 MiB, in addition to the existing input/schema limits. No legacy parser fallback is shipped.
