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

`RuntimeLifecycle` stores one `Copy` state enum under its mutex and applies the
exact 12 stable edges through a total transition function. It allocates no
validated names or transition table per instance. The generic public
`StateMachine` remains available and unchanged for application-owned states.

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

With an attached `FileOperationalJournal`, live audit entries and safe restored
entries retain one shared immutable operational record. Journal load validates
the hash chain, checks audit text without allocating, sanitizes only unsafe
content and atomically rewrites it before exposure. Later log attachment copies
only bounded `Arc` handles. Owned APIs, snapshot JSON and V1 persistence remain
unchanged. A single attachment over 384 safe entries (about 3 MiB) reduced p50
from 12.26 ms to 86.50 us (-99.29%), peak RSS by 0.57% and workload RSS by
1.72% on Apple M1. The separate real-fsync workload retains its earlier 27.83%
p50, 37.30% peak-RSS and 47.93% retained-memory improvements.

The process-local `EventBus` separately retains at most 10,000 events and
16 MiB by default. `stats` exposes current/peak bytes, evictions and oversized
event rejections; `snapshot().recent(limit)` borrows a stable newest page.
Selecting 1,000 of 10,000 events measured 2.39 us p50 and 8.48 MiB peak RSS,
versus 2.09 ms and 14.59 MiB for the compatible full-copy method.
When a `FileOperationalJournal` is attached, it and the bus retain one shared
immutable event record allocation. Restore copies only bounded `Arc` handles;
owned APIs, snapshot JSON and the V1 journal format do not change. A real-fsync
3 MiB workload reduced peak RSS from 8.11 to 5.08 MiB (-37.38%) and retained
workload memory by 48.00%, with disk-dominated p50 within +0.95%.

New applications consume these contracts through `appcore_sdk`; they do not
assemble the core manually. Keep I/O
adapters and domain behavior outside this crate.

**Maturity:** stable low-level surface; builder/plugin APIs are compatibility
level, while manifest-first hosting is preferred.
