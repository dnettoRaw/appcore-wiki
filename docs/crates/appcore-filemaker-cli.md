---
title: appcore-filemaker-cli — RC
---

# appcore-filemaker-cli

:::info Release candidate
Candidate **`1.0.0-rc.2`**, awaiting final release qualification and registry publication. Select the exact package only after verification.
:::

> **PUBLIC BETA** — `0.1.0-beta.5` is available on crates.io for evaluation.

`appcore-filemaker-cli 0.1.0-beta.5` is the bounded process adapter for
`appcore-filemaker`. It is published on crates.io as a beta prerelease.

The command selects export format; template YAML never does. `check`,
`validate`, `preflight`, and diagnostic commands are read-only except for
explicit output artifacts. `render` and `mask` publish files atomically.
They reject an output resolving to the input template. `migrate` is reserved
and fails without modifying input; future mutation requires an explicit flag
and contract. Every command has concise human output plus stable JSON for
automation.
Both stdout modes end with one newline and stop at 512 MiB. Pretty JSON is sized
before output and serialized directly through a fixed 16 KiB buffer, avoiding a
second complete output string.

`capabilities --json` publishes the stable exit matrix: 0 success, 2
validation, 64 usage, 65 data, 66 missing input, 69 unavailable, 70 software,
73 cannot-create, 74 I/O, 75 temporary resource failure, and 130 cancellation.

`schema --json` reports typed colors, the executable style cascade, semantic
Canvas coordinate units, primitives and path commands, prepared advanced
graphics, paint-only export overrides, and collision-independent layer/z-index
ordering.

`debug TEMPLATE --grid 1|5|10|20 --view combined` emits the complete
non-mutating overlay. `mask` exports collision/layout/visual/combined geometry
as PNG, PDF, SVG, or stable occupied/free/collisions/overflow JSON. `inspect`
and `explain` expose source geometry, anchors, region, measurement, collision,
page/reflow, and provenance retained by the resolved scene.
`free-regions` queries bounded available rectangles. Repeatable `--patch`
applies ordered runtime patch JSON, while `--font-fallback` defines the exact
registered fallback order. `render --format csv` exports one selected bound
table without inventing graphical layout for dataset rows.

`capabilities --json` exposes editable, flattened, and hybrid PDF. Hybrid adds
invisible subsetted Unicode text over deterministic outlines. WebP, XLSX, ZPL,
ESC/POS, PDF/A, links, bookmarks, and tagged accessibility remain prepared.
`schema --json` also states the writer/bounded-byte, strict/best-effort loss,
raster-only DPI, deterministic PDF metadata, and font-subset contracts.

`check`, `validate`, and `preflight` are separate schema, resolved-layout, and
exporter-aware boundaries. JSON retains bounded warnings and explicit
`truncated`; strict rejects warnings and truncation fails closed. Schema
discovery also lists typed-data validation, complete fingerprint inputs, and
bounded immutable resolve-on-miss caching.

Template, data, and font inputs are read through one opened handle and stop at
`limit + 1` bytes. Debug and mask commands pass the same core limits into
bounded diagnostic geometry.

Its direct AppCore dependencies are `appcore-args` and `appcore-filemaker`.

The documented commands use concrete separate
[`basic.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/examples/basic.yml)
and [`intermediate.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/examples/intermediate.yml)
inputs, plus typed JSON data for the intermediate flow.

Crate-owned documentation: [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/basic.en.md), and
[intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/intermediate.en.md).

## Published package

[`appcore-filemaker-cli 0.1.0-beta.5`](https://crates.io/crates/appcore-filemaker-cli/0.1.0-beta.5) · [docs.rs](https://docs.rs/appcore-filemaker-cli/0.1.0-beta.5) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-filemaker-cli).

## Independent prerelease — 2026-10-14

`0.1.0-beta.6`: dependency metadata alignment.

[crates.io](https://crates.io/crates/appcore-filemaker-cli/0.1.0-beta.6) · [docs.rs](https://docs.rs/appcore-filemaker-cli/0.1.0-beta.6)

## 1.0.0-rc.2

Exact dependency pins select the qualified AI security distribution and FileMaker RC where applicable. Public APIs, default features and V1 inputs are unchanged. Select the exact release and refresh the full lockfile explicitly; old exact pins remain immutable. The optional backend uses the registry security distributions documented on the AI page. This does not certify hardware or migrate an external application.
