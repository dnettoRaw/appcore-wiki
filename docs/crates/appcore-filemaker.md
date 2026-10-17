---
title: appcore-filemaker — RC
---

# appcore-filemaker

:::info Release candidate
Candidate **`1.0.0-rc.2`**, awaiting final release qualification and registry publication. Select the exact package only after verification.
:::

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

## Variable-content layout audit (2026-10-17)

Published-baseline audit (the defects below describe the audited package): text measurement, expand,
flow, anchors, keep rules, audit/preflight and geometry overlays already exist.
Those baseline gaps are addressed by the opt-in 1.0.0-rc.2 APIs documented below.
Six lines with expand plus max_lines can be truncated without a diagnostic;
next_page can restart at y=0 despite margins; layout audit does not yet apply
collision-group exceptions consistently. Zero export losses are not layout
safety. Compatible fixes must precede recommendations for strict acceptance.
The first audit ran 55 existing tests and rendered synthetic 1/2/5/20-page
controls without reordering; that does not qualify the complete commercial
acceptance corpus. Planned opt-in sizing and bounded last-page convergence
require explicit contracts and migration; published V1 semantics stay intact.


The 1.0.0-rc.2 implementation now diagnoses capped expansion, preserves its warning through pagination, includes keep-block padding, respects continuation page/region bounds including parent transforms, and shares collision group/ignore/overlay rules with layout audit. Public fields, YAML V1, explicit caps and page-band painting are preserved. Intrinsic body containers now have the opt-in API below; adaptive table bodies now have a separate opt-in plan; this correction is included in 1.0.0-rc.2.

## Intrinsic height (opt-in, 1.0.0-rc.2)

Call `LayoutEngine::resolve_intrinsic(&document)` instead of `resolve` to give
explicit YAML `height: auto` content-based sizing. Existing `resolve`, V1
parsing, public struct literals and fixed-height overflow policies stay intact.
No new dependency or consumer-side measurement is required.

Text uses the existing shaping/measurement path, registered font, resolved
style, width, inline/block padding and line advances. Horizontal flow groups
use the largest child height; vertical flows sum heights and declared gaps.
`constraints: {min_height: 14mm}` retains the short design. Existing anchors
and flow see the measured box before collision placement. Input IR is unchanged.
A content height above `max_height` fails with the element ID instead of clipping.

This first opt-in supports definite widths and start-distributed body flows.
Automatic text accepts horizontal `wrap`, `expand` or `error`, without
`max_lines`; use a fixed height to explicitly select `clip`, `ellipsis` or
`shrink`. Automatic groups are indivisible and must fit one useful page.
Inside an automatic group, children must have no explicit x/y, anchors,
region, transforms, non-start geometry alignment, keep-with-next or
height-relative constraints. An expanding text child must itself use auto
height. Absolute/distributed automatic groups, vertical writing, automatic
page bands, aspect ratio/preferred height on auto nodes and percentage block
padding on automatic text fail explicitly. These restrictions avoid circular
measurement and incorrect estimates; they are not implicit fallbacks.

The walk checks cancellation, element/text limits and a maximum nesting depth
of 64 before cloning the bound document. Measurement checks cancellation per
node; shaping one node is not preemptible. The clone and measurement add work
and memory; no throughput or RSS improvement is claimed. Use layout preflight
on the final scene, including fixed elements and intentional overlays. Do not
reuse ordinary-layout scene cache keys for intrinsic resolution.

Run `cargo run -p appcore-filemaker --example intrinsic_height --locked`.
The shared `examples/intrinsic-height.yml` binds separate short/long JSON data,
keeps two columns and right-aligned text, and moves the title/body through
anchors. Outputs are under `target/filemaker-examples/`. No YAML coordinates
are substituted in Rust. The example enforces layout diagnostics before PDF
export. A successful export alone is not layout approval.

Migration is opt-in at the layout call, with auto heights/minimum heights in
the YAML. Keep the original design and call `resolve` for rollback. This is an
additive Rust API; it introduces no alternative YAML parser/version. Adaptive
first/intermediate/last/single table bodies and final reservations now use the separate adaptive plan; arbitrary global flow is outside that contract.

Within a root participating in intrinsic planning, containing groups are
structural: descendant collision policies explicitly ignore their ancestor
IDs. Sibling and external collision rules remain enabled. Ordinary resolution
and roots without auto heights retain their existing policies.

The earlier ligature-extraction finding is corrected in the 1.0.0-rc.2 exporter; full clusters and context-specific `/ActualText` preserve logical text. Continue independent text-extraction and visual checks.

## Adaptive table pagination (opt-in, 1.0.0-rc.2)

`AdaptiveLayoutPlan::parse_yaml` reads a separate strict `filemaker_layout: '1.0'`
YAML design. Call `LayoutEngine::resolve_adaptive(&document, &plan)` after the
existing V1 compile/bind pipeline. This additive API preserves existing public
struct literals, V1 parsing, `resolve` and `resolve_intrinsic`. No dependency,
wire/storage version or application-specific rule is added.

The plan selects one root table, its `first`, `intermediate`, `last` and
`single` vertical bodies, a final root `closing` element, its gap and the
required `oversized_group: error` or `split_rows` policy. Body offsets/heights
are relative to the complete table box, with fixed width. All four bodies must
fit inside that box and the table box must fit the useful page region.

The declared bodies are BEFORE the closing reservation. The visible closing
height is computed with the existing intrinsic sizing and constraints. Its
height plus gap is subtracted exactly once from `single` or `last`. The table
header is then subtracted exactly once by the existing paginator. Hidden
closing blocks reserve neither height nor gap. There is no automatic reservation
for decorative page bands; their existing V1 semantics remain unchanged.

The existing pending group provides final-group lookahead. Only its final row
carries the difference between ordinary and final-page capacities. If that row
or group moves, its reserve and page-sensitive measurements are recalculated
for the destination. The final fragment is then translated into the selected
last/single body, and existing anchors place the closing block after its bottom.
No guessed last-page count or global fixed-point loop is needed for this
restricted vertical-table problem. Column sampling and group measurement may
still visit rows more than once; this is not a one-read streaming guarantee.

Equal contiguous `keep_together_by` keys remain together when the group and
its final reserve fit a destination. `split_rows` falls back between rows when
that combined requirement cannot fit; `error` rejects it. One indivisible row
plus reserve that cannot fit fails under either policy. A group that would
leave a completely empty first page fails explicitly, rather than returning
an empty page or silently reclassifying a continuation as a first page.
An empty dataset may render its header and closing, but the header must fit.

Current boundaries are explicit: one visible root table beginning on physical
page zero; one final body block anchored by `top: table-id.bottom+gap`; no
transforms/regions/keep-with-next on those two roots. The closing may be an
automatic text or flow group. Its descendants must remain inside its measured
box on the final table page. A conflicting collision or changing fixed-text
height produces an error with no partial returned scene. No table `page_bodies`,
conditional `reserve_after`, or built-in `total_fields` may be combined with
this reservation owner. Bind totals in the closing block as application data.
Multiple tables, wider/narrower final regions and arbitrary page-dependent
whole-document flow require a later explicit contract, not inferred behavior.

Resource limits still bound template bytes, nesting, elements, rows, pages and
collision work. Cancellation is checked before planning, during row visitation,
measurement and reservation evaluation. Individual shaping calls remain
cooperative boundaries. The existing spatial index is unchanged; no speed or
RSS gain is claimed. Preflight layout and export separately; successful export
or zero declared export losses does not prove geometry or text-layer fidelity.
The earlier ligature-extraction finding is corrected in the 1.0.0-rc.2 exporter; full clusters and context-specific `/ActualText` preserve logical text. Continue independent text-extraction and visual checks.

Run `cargo run -p appcore-filemaker --example adaptive_pagination --locked`.
`examples/adaptive-pagination.yml`, `adaptive-pagination-plan.yml` and separate
typed JSON datasets generate 1/2/5/20-page examples in `target/filemaker-examples/`.
The example enforces layout audit and export preflight before writing each PDF.
The 8-row regression falls from 3 pages to 2 with one closing reservation;
source row indices remain ordered and unique. No consumer measures text or
patches YAML strings in Rust.

Migration: retain the original template, move its body design to the plan,
remove the competing V1/row reservations, declare the closing anchor and select
the new layout call. Rollback restores that original template and layout call;
input data and persisted formats do not change. Included in `1.0.0-rc.2`; the external application has not been migrated.

`first_after: {element: title, gap: 8pt}` optionally moves the start of both
`first` and `single` below an earlier measured layout box on physical page zero.
Their declared bottoms are preserved; the start is never moved above the
original offset. This links an automatic two-column header and title to the
first table region without caller-side coordinate arithmetic. The table's
complete box may overlap those earlier boxes while its selected content body
does not: declare explicit local `collision.ignore` IDs in the template, as in
`examples/adaptive-header.yml`. No global collision disable is necessary.
An unresolved/later/other-page target or exhausted first body fails explicitly.
Non-empty datasets must place rows on the first page; an initial deferral that
would leave only headings is rejected rather than returning an orphan title.

Run `cargo run -p appcore-filemaker --example adaptive_header --locked` for the
short/long header workflow. The shared YAML and plan bind separate synthetic
JSON data; both layout audit and export preflight are enforced. Main pagination
and header examples together produce six PDF documents, for visual inspection.

## Bounded pagination evidence (1.0.0-rc.2 addition)

Use `LayoutEngine::diagnose_adaptive(&document, &plan, max_decisions)` instead
of `resolve_adaptive` when an explanation is needed. `AdaptiveLayoutReport`
exposes `outcome()`, `decisions()` and `into_outcome()`. Inspect or save decisions
before propagating the result: earlier evidence remains available on failure.
Each call owns independent evidence. Existing entrypoints and public struct
literals are unchanged; ordinary resolution creates no recorder.

Each `PaginationDecision` records the table ID, zero-based physical candidate
page, inclusive source row ordinals, the actual rule and numeric heights:
`capacity` excludes the table header once; `used_height` includes prior rows
and their reservations; `available_height = capacity - used_height`;
`required_height = group_height + reserved_height`. `final_reservation` is
part of `reserved_height`, never an additional amount to add. It combines the
closing block and gap with the difference between normal and final body heights;
it is not necessarily just the closing block height.

Rules are `fit`, `move_group`, `split_rows`, `move_row`, `skip_first_page` and
`reject`. Move records describe the source candidate before advancing; a later
fit uses destination measurements and reservation. Oversize policy decisions
assess an empty continuation candidate, even if that page is never emitted.
Records are execution evidence, not a list of emitted pages or a successful
export guarantee. Validation before pagination can fail with no decisions;
a rejection after pagination may retain earlier fit decisions but no scene.
An empty dataset has no row decisions. The rule enum is non-exhaustive.

The explicit record limit must be between one and `ResourceLimits.max_elements`.
Exhaustion returns `LimitExceeded`, preserving the prefix, without silently
truncating or returning a partial scene. Records retain IDs, row ordinals and
geometry, not row text, payloads or grouping values. The opt-in collector uses
short bounded mutex sections and keeps engine Send/Sync characteristics; it adds
allocation/serialization cost and is not enabled by default. Cancellation and
existing page, row and measurement bounds still apply.

`cargo run -p appcore-filemaker --example adaptive_pagination --locked` writes
`*-pagination.json`, `*-debug.json` and per-page `*-mask-*.svg` alongside the
1/2/5/20-page outputs. It reuses `DebugOverlay::build_bounded` (safe areas,
regions, layout/intrinsic/visual boxes and anchors) and the existing
`CollisionMask` SVG exporter. Masks describe geometric occupancy; use
`audit_layout` for effective overlap policies. `SceneInspector::explain_layout`
provides final element provenance, while `audit_layout` identifies collision
and clipping geometry. Continue strict preflight and rendered-PDF review:
zero exporter losses do not prove that layout is safe. Debug overlay labels
can contain source expressions; review them before external sharing.

Rollback: call `resolve_adaptive` again and stop saving diagnostic outputs.
No YAML, persistent format, dependency, spatial index or consumer migration.

`header_height` records the applied header reservation; `body_height = capacity + header_height` exposes its normal body before that subtraction.

## Mixed synthetic corpus and consumer adoption gate


Run `cargo run -p appcore-filemaker --example variable_corpus --locked`.
One YAML design and a separate adaptive plan bind four synthetic typed JSON datasets.
The outputs under `target/filemaker-examples/variable-corpus-*` include PDF,
resolved scene, strict preflight, pagination decisions, debug overlay and SVG masks.
This increment also fixes page-band paint precedence in the existing engine. No dependency, public API, serialized field or published version changes.

| Pages | Groups | Source rows |
|---|---|---|
| 1 | 3 | 9 |
| 2 | 12 | 36 |
| 5 | 40 | 120 |
| 20 | 190 | 570 |

Each group contains an item, a variable-length description and a comment with a
detailed discount. The three rows share `keep_together_by`; `oversized_group: error`
explicitly rejects a description that cannot fit a page. The test also checks
logical shaped text and measured cell heights, not only retained source strings.
The two-column automatic header, dependent title and first body share native
measurement. Three displayed TVA rates, pre-discount values, discount details,
net/tax/final totals, conditions, signature and an EAN-13 are consumer-supplied
fixture data. FileMaker performs no fiscal calculations or business validation.
The fixture totals are internally consistent, but this corpus is not fiscal certification.

The first old value has a line over its cell, using an explicit local overlay.
The watermark on every page and the first-page stamp use existing page bands:
those bands already have a non-colliding paint contract and reject an explicit
`collision` field. Global body collision detection stays enabled. Sparse row
anchors must be omitted or null where absent, not repeated empty strings.
Body X coordinates are relative to the useful-region origin; a regression checks
that the strike stays inside its intended value cell after applying that origin.
This corrected fixture configuration, not an engine or shaping defect.

Tests assert exactly-once row order, complete cell text, intact groups, expected
page counts, local strike geometry and final-only closing descendants, including
barcode and signature. Strict `audit_layout` and export preflight both run.
The PDF pages must also be rendered and visually reviewed: exporter loss counts
alone cannot approve layout. The earlier ligature-extraction finding is corrected in the 1.0.0-rc.2 exporter; full clusters and context-specific `/ActualText` preserve logical text. Continue independent text-extraction and visual checks. SVG masks show geometric occupancy, while
`audit_layout` applies intentional-overlap policies.


Consumer adoption requires a newly published exact registry RC; no local patch or external consumer change is included.

Reproduce the PDF checks after running the example: `python3 crates/appcore-filemaker/wiki/audit/verify-variable-corpus.py`. Requires Poppler, verifies ordered item/description/comment IDs, supplied summary lines, 95 rendered EAN-13 modules and quiet zones, and renders all 28 pages. It does not replace visual review or scanner certification.

The watermark belongs in `page.master.background`. `z_index` orders paint within a layer; a negative value in `header` does not move the watermark behind body glyphs. The corpus regression first failed with the header band, then checks the resolved background layer and paint order. Strict preflight had passed the obscuring configuration.

The corpus exposed an engine defect as well: lexical sorting placed the empty body layer before `!page-background`, and custom Unicode layer names could sort after the foreground band. The compatible correction assigns page-band precedence explicitly: background, body, header/footer. Body layer names retain their lexical order, then z-index and source sequence. Tests cover empty/custom/Unicode layers, extreme z-index values and actual raster pixels. No spatial-index replacement or new API is involved.

## Complete Unicode text in PDF (1.0.0-rc.2 correction)

Editable and Hybrid PDF export now map each single-glyph shaping cluster to its
complete logical UTF-8 sequence in `ToUnicode`, rather than its first scalar.
The existing PDF writer emits the UTF-16 CMap destinations, including surrogate
pairs. Cluster ends follow sorted logical byte offsets, independent of visual
RTL glyph order. Invalid UTF-8 boundaries, terminal and out-of-range offsets
return `ExportUnsupported` instead of silently omitting text mappings.

A glyph can occur as both `fi` and the literal `ﬁ`, or represent composed and
decomposed text. One font-level mapping cannot describe every occurrence.
Runs with conflicting mappings or multi-glyph clusters retain their original
logical text in PDF `/ActualText` spans. Multi-glyph clusters are not mapped to
the entire source once per glyph. No Unicode normalization is applied.
Readers extracting those context-dependent cases must honor `/ActualText`.

This uses the existing PDF 1.7 output, fonts, glyph IDs, advances and geometry.
There are no new dependencies, public fields, YAML options or APIs. Standard 14
WinAnsi text retains its existing route. Flattened remains vector outlines
without searchable text. This correction changes exporter text mapping, not
layout, shaping, clipping policy, or bidi positioning. RTL extraction tools can
return visual order with direction controls; the sample verifies its complete
unmarked character sequence in either logical or visual order.

Unicode strings retained across font CMaps share an explicit
`ResourceLimits.max_output_bytes` budget, checked before allocation. Temporary
cluster indexing is linear in the existing bounded glyph count; sorting and
lookup add work but do not repeat shaping. Existing scene, text and output
limits remain active. No constant-RSS or export-speed improvement is claimed.

Run `cargo run -p appcore-filemaker --example pdf_unicode --locked` to create
Editable, Hybrid and Flattened samples. They cover `fi/fl/ffi/ffl`, normal words,
literal presentation ligatures, composed/decomposed accents, an isolated
multi-glyph cluster with its own font resource, and Arabic clusters.

After generating them, run
`python3 crates/appcore-filemaker/wiki/audit/verify-pdf-unicode.py`.
Requires Poppler, renders each mode, checks exact Latin scalars without NFC/NFKC
normalization, verifies the fixed RTL sample and outline-only Flattened output,
and compares Hybrid/Flattened pixels. Strict layout audit and preflight remain
separate from text extraction and rendered-page review.

The mixed corpus verifier now checks all resolved element and table-cell text,
not only row IDs and totals. Existing PDFs must be re-exported to receive this
correction. Source-only changes are not available to registry-pinned consumers
until a new exact RC is published and qualified. This change is included in `1.0.0-rc.2`; external consumer migration remains separate. Rollback selects the
previous qualified exporter release explicitly.
