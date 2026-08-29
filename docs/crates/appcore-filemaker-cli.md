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

Its direct AppCore dependencies are `appcore-args` and `appcore-filemaker`.

Crate-owned documentation: [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/basic.en.md), and
[intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/intermediate.en.md).
