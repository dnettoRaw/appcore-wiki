---
title: appcore-filemaker-cli — 0.1 alpha
---

# appcore-filemaker-cli

`appcore-filemaker-cli 0.1.0-alpha.1` is the bounded process adapter for
`appcore-filemaker`. It is a source preview and has not been published to
crates.io.

The command selects export format; template YAML never does. `check`,
`validate`, `preflight`, and diagnostic commands are read-only except for
explicit output artifacts. `render` and `mask` publish files atomically.
`migrate` is reserved and fails without modifying input. Stable JSON responses
support automation while typed failures retain nonzero exit codes.

`schema --json` reports typed colors, the executable style cascade, semantic
Canvas coordinate units, primitives and path commands, prepared advanced
graphics, paint-only export overrides, and collision-independent layer/z-index
ordering.

`debug TEMPLATE --grid 1|5|10|20 --view combined` emits the complete
non-mutating overlay. `mask` exports collision/layout/visual/combined geometry
as PNG, PDF, SVG, or stable occupied/free/collisions/overflow JSON. `inspect`
and `explain` expose source geometry, anchors, region, measurement, collision,
page/reflow, and provenance retained by the resolved scene.

`capabilities --json` separates implemented formats from prepared WebP, XLSX,
ZPL, ESC/POS, PDF/A, Hybrid PDF, links, bookmarks, and tagged accessibility.
`schema --json` also states the writer/bounded-byte, strict/best-effort loss,
raster-only DPI, deterministic PDF metadata, and font-subset contracts.

Its direct AppCore dependencies are `appcore-args` and `appcore-filemaker`.

Crate-owned documentation: [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/basic.en.md), and
[intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/intermediate.en.md).
