---
title: appcore-args
sidebar_position: 1
---

# appcore-args

:::info Independently published package
Stable **`1.0.2`** · MSRV
**Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-args/1.0.2) ·
[docs.rs](https://docs.rs/crate/appcore-args/1.0.2) ·
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

## Declarative configuration and native paths

Additions available in `1.0.3-rc`: `OptionSpec::env`, `default_value`, `value_kind`
and `exclusive_group`. Precedence is argv, declared environment, then one
fallback value. Flags from env/default accept only `true` or `false`; false
means absent. Required options, conflicts and requirements are checked after
resolution. A group accepts at most one member and `requires("source")` can
require a member of that group. Environment/default values are bounded together
with argv. Terminal help skips environment lookup, but still validates the spec.
Errors from environment/default validation and parsed option Debug hide values.
Help/completion never read environment values.

Use `ValueKind::Path` for a nonempty native path or `ValueKind::SocketAddr` for a
numeric IP/port (including bracketed IPv6, without DNS). `ValueType` retains its
existing enum. `RawArgs` remains UTF-8-only; `RawOsArgs::from_env` and
`CliParser::parse_os` preserve native paths and passthrough. Non-UTF-8 text,
option names and addresses fail. Paths are not canonicalized or checked for
existence. `option_path` returns `PathBuf`; `option_socket_addr` returns a typed
address. `parse_with_env` and `parse_os_with_env` allow deterministic injection.

```rust
use appcore_args::{CliSpec, CliParser, OptionSpec, RawOsArgs, ValueKind};
let spec = CliSpec::new("node")
    .option(OptionSpec::value("data-dir").env("NODE_DATA_DIR")
        .default_value("./data").value_kind(ValueKind::Path))
    .option(OptionSpec::value("bind").env("NODE_BIND")
        .default_value("127.0.0.1:9000").value_kind(ValueKind::SocketAddr))
    .option(OptionSpec::value("descriptor").exclusive_group("source"))
    .option(OptionSpec::value("catalog").exclusive_group("source"))
    .option(OptionSpec::flag("serve").requires("source"));
let raw = RawOsArgs::parse([std::ffi::OsString::from("--bind=[::1]:9000")])?;
let parsed = CliParser::new(&spec).parse_os_with_env(&raw, |_| None)?;
assert!(parsed.option_path("data-dir").is_some());
assert_eq!(parsed.option_socket_addr("bind")?.unwrap().port(), 9000);
# Ok::<(), appcore_args::CliError>(())
```

## Published release

`1.0.3-rc` — published on crates.io; previously published versions remain immutable.

## Published package

[`appcore-args 1.0.3-rc`](https://crates.io/crates/appcore-args/1.0.3-rc) · [docs.rs](https://docs.rs/appcore-args/1.0.3-rc) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-args).
