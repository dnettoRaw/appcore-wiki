---
title: appcore-args
sidebar_position: 1
---

# appcore-args

:::info Independently published package
Stable **`1.0.1`** · MSRV
**Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-args/1.0.1) ·
[docs.rs](https://docs.rs/crate/appcore-args/1.0.1) ·
[source](https://github.com/dnettoRaw/app-core-public/tree/main/crates/appcore-args)
:::

## Crate-owned guide and examples

The public repository maintains the detailed [guide](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/examples/basic.en.md),
and [intermediate example](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/examples/intermediate.en.md).

**Responsibility:** declarative CLI specifications, bounded argument ingestion,
deterministic parsing, help rendering and shell completion.

**Direct AppCore dependencies:** None. This is a standalone crate with its own
SemVer line.

**Primary API:** `CliSpec`, `CommandSpec`, `OptionSpec`, `ArgumentSpec`,
`ValueType`, `RawArgs`, `HelpRenderer`, `CompletionEngine` and
`render_dynamic_completion_script`.

Every specification is validated before parsing, help, or completion. Default
input limits are 1,024 words, 64 KiB per word, and 1 MiB total; non-UTF-8 and
NUL input fails closed. Optional values use attached syntax by default, avoiding
ambiguous consumption of the next positional. Detached optional values require
an explicit opt-in.

Dynamic completion supports Bash, Zsh, Fish, and PowerShell. Suggestions are
bounded to 128-byte inputs and candidates.

**Maturity:** independently versioned public CLI foundation.
