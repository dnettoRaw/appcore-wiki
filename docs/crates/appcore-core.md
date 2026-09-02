---
title: appcore-core
sidebar_position: 8
---

# appcore-core

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-core/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-core/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-core)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** generic in-process Runtime lifecycle, registration,
dispatch, state, audit and idempotency.

**Internal dependencies:** `appcore-contracts`, `appcore-types`.

**Primary API:** `RuntimeBuilder`, `RuntimeController`, `RuntimeInstance`,
`RuntimeLifecycle`, command/event registries and buses, envelopes,
`CommandHandler`, `CommandResult`, `RuntimeContext`, audit log and journal,
in-memory/file idempotency, state and decision registries/engines, clock,
redaction and compatibility `AppPlugin`.

On the current 1.0 maintenance line, cloned `RuntimeController` values share
lifecycle, idempotency and in-flight state, while the immutable command bus
owns handlers through `Arc`. Independent handlers execute concurrently; one
idempotency key still admits at most one execution. Shutdown closes admission
atomically before a bounded drain of admitted commands.

The process-local `AuditLog` bounds its command and generic-entry snapshots by
10,000 items and one shared 16 MiB default budget. `with_max_bytes` can tighten
the budget; `stats` exposes current/peak bytes, evictions and rejections;
`write_jsonl` streams a shared copy-on-write snapshot after releasing the state
lock. The compatible `export_jsonl` adapter intentionally returns an owned
string.

Use `entries_snapshot` for a structured JSON array. The immutable view
implements `Serialize`, shares the retained entry storage instead of
deep-cloning it and stays stable after later log mutations. The measured
10,000-entry pretty-JSON fixture was 2,996,676 bytes, with 1.12 ms p50 and
6.42 MiB peak RSS on Apple M1.

`records_snapshot` provides the corresponding command-record view. Both
snapshot types expose `recent(limit)` so callers can borrow only a newest page
after releasing the state lock. A 1,000-of-10,000 selection measured 2.06 us
p50 and 11.88 MiB peak RSS, versus 4.16 ms and 20.33 MiB for full owned copies.

New applications consume these re-exports through
`appcore_bin::application`; they do not assemble the core manually. Keep I/O
adapters and domain behavior outside this crate.

**Maturity:** stable low-level surface; builder/plugin APIs are compatibility
level, while manifest-first hosting is preferred.
