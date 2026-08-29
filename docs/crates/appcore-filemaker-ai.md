---
title: appcore-filemaker-ai — 0.1 alpha
---

# appcore-filemaker-ai

`appcore-filemaker-ai 0.1.0-alpha.1` is the optional bounded bridge from
`appcore-ai` tool calls to deterministic FileMaker sessions. It is a source
preview and has not been published to crates.io.

The bridge declares 20 exact tools, enforces call, patch, and result-byte
budgets, and applies template editable/locked policy before atomic mutations.
Queries do not change revision. Artifact tools return bounded in-memory base64
and never select a filesystem path.

`filemaker_schema` reports typed colors, every cascade layer, paint ordering,
and resolver boundaries. `filemaker_set` and typed patches accept transactional
`set_style`; export overrides remain paint-only and cannot change layout.

Direct AppCore dependencies are `appcore-ai` and `appcore-filemaker`. AI policy
and orchestration remain outside the deterministic compiler.

Crate-owned documentation: [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.en.md), and
[intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.en.md).
