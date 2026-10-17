---
title: appcore-filemaker-ai — RC
---

# appcore-filemaker-ai

:::info Release candidate
Candidate **`1.0.0-rc.2`**, awaiting final release qualification and registry publication. Select the exact package only after verification.
:::

> **PUBLIC BETA** — `0.1.0-beta.5` is available on crates.io for evaluation.

`appcore-filemaker-ai 0.1.0-beta.5` is the optional bounded bridge from
`appcore-ai` tool calls to deterministic FileMaker sessions. It is published
on crates.io as a beta prerelease.

The bridge declares 20 exact tools with closed execution-matched schemas,
enforces call, argument, core-capped patch, and result-byte budgets, and applies
template editable/locked policy across destructive subtrees before atomic
mutations. Candidate documents validate and graphical models resolve before commit; patch
sequences equal the next revision. Queries do not change revision. Artifact
tools return bounded in-memory base64 and never select a filesystem path.
Result sizing serializes into a non-retaining limited counter, stops on the
first byte beyond `max_result_bytes`, and never allocates a second complete JSON
buffer merely to enforce policy.
`filemaker_export` also selects a bound dataset table and returns bounded CSV;
dataset sessions never fabricate a graphical page. The tested recommended loop
executes create, patch, inspect, validate, preview, debug mask, and export.

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

Capability discovery exposes editable, flattened, and hybrid PDF. Hybrid paints
deterministic outlines plus invisible subsetted Unicode text for search,
selection, and extraction. WebP, XLSX, ZPL, ESC/POS, PDF/A, links, bookmarks,
and tagged accessibility remain prepared. Its export contract names caller-owned writers or bounded bytes,
strict/best-effort loss reports, raster-only DPI, deterministic PDF metadata,
and PDF font subsets, so a model cannot infer unsupported output.

`filemaker_validate` returns bounded layout issues and explicit truncation.
`filemaker_preflight` declares its actual format, fidelity, mode, page, DPI,
strict, and accessibility inputs. Schema discovery names the four validation
stages, complete fingerprint inputs, and resolve-on-miss immutable caching.

Debug-mask and free-region tools pass the session's core limits into bounded
diagnostic geometry, preventing the optional bridge from bypassing comparison
or retained-geometry budgets.

Direct AppCore dependencies are `appcore-ai` and `appcore-filemaker`. AI policy
and orchestration remain outside the deterministic compiler.

Crate-owned documentation: [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.en.md), and
[intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.en.md).

## Published package

[`appcore-filemaker-ai 0.1.0-beta.5`](https://crates.io/crates/appcore-filemaker-ai/0.1.0-beta.5) · [docs.rs](https://docs.rs/appcore-filemaker-ai/0.1.0-beta.5) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-filemaker-ai).

## Independent prerelease — 2026-10-14

`0.1.0-beta.6`: dependency metadata alignment.

[crates.io](https://crates.io/crates/appcore-filemaker-ai/0.1.0-beta.6) · [docs.rs](https://docs.rs/appcore-filemaker-ai/0.1.0-beta.6)

## 1.0.0-rc.2

Exact dependency pins select the qualified AI security distribution and FileMaker RC where applicable. Public APIs, default features and V1 inputs are unchanged. Select the exact release and refresh the full lockfile explicitly; old exact pins remain immutable. The optional backend uses the registry security distributions documented on the AI page. This does not certify hardware or migrate an external application.
