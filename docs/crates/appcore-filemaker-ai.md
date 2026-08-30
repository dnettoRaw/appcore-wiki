---
title: appcore-filemaker-ai — 0.1 alpha
---

# appcore-filemaker-ai

`appcore-filemaker-ai 0.1.0-alpha.1` is the optional bounded bridge from
`appcore-ai` tool calls to deterministic FileMaker sessions. It is a source
preview and has not been published to crates.io.

The bridge declares 20 exact tools with closed execution-matched schemas,
enforces call, argument, core-capped patch, and result-byte budgets, and applies
template editable/locked policy across destructive subtrees before atomic
mutations. Candidate documents validate and resolve before commit; patch
sequences equal the next revision. Queries do not change revision. Artifact
tools return bounded in-memory base64 and never select a filesystem path.

Capabilities provide remaining calls plus compact purpose/rules and
editable/locked document context. Replacing a trusted document would also
replace that author policy, so `load` requires explicit host opt-in through
`allow_document_replacement`, which is false by default. Failed loads and
patches preserve both state and revision.

`filemaker_schema` reports typed colors, every cascade layer, semantic Canvas
units/primitives, paint ordering, resolver boundaries, and prepared advanced
graphics. `filemaker_add` accepts a compact strict source element identified by
`type`, or complete IR identified by `kind`; fields requiring compiler
expansion or data binding fail explicitly. `filemaker_set` and typed patches
accept transactional `set_style`; export overrides remain paint-only and
cannot change layout.

Inspection accepts an element ID or a page and returns the retained structured
geometry/reflow trace. Debug-mask tool input explicitly declares page and
collision/layout/visual/combined view, while free-region input declares its
minimum dimensions; these accepted arguments are no longer hidden behind empty
tool schemas.

Capability discovery separates implemented exporters from prepared WebP,
XLSX, ZPL, ESC/POS, PDF/A, Hybrid PDF, links, bookmarks, and tagged
accessibility. Its export contract names caller-owned writers or bounded bytes,
strict/best-effort loss reports, raster-only DPI, deterministic PDF metadata,
and editable-PDF font subsets, so a model cannot infer unsupported output.

`filemaker_validate` returns bounded layout issues and explicit truncation.
`filemaker_preflight` declares its actual format, fidelity, mode, page, DPI,
strict, and accessibility inputs. Schema discovery names the four validation
stages, complete fingerprint inputs, and resolve-on-miss immutable caching.

Direct AppCore dependencies are `appcore-ai` and `appcore-filemaker`. AI policy
and orchestration remain outside the deterministic compiler.

Crate-owned documentation: [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.en.md), and
[intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.en.md).
