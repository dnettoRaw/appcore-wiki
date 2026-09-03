---
title: appcore-ops
sidebar_position: 13
---

# appcore-ops

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-ops/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-ops/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-ops)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** vendor-neutral Runtime health, logging, metrics,
observations, heartbeat and availability.

**Internal dependencies:** `appcore-core`, `appcore-supervisor`.

**Primary API:** health status/report/checks, heartbeat sources, log levels and
logger implementations, metric counters and in-memory metrics,
`ObservationEvent`/`ObservationSink`, bounded file sink and statistics,
availability reports and compatibility reexports for
`appcore-supervisor::managed_services`.

The process-local observation sink retains at most 65,536 events and 16 MiB;
the metric registry retains at most 4,096 names, 128 bytes per name and 1 MiB
aggregate. Both expose count/byte pressure and immutable shared snapshots while
keeping the owned snapshot APIs compatible. Oversized observations are not
retained but still reach the at most 32 configured drains. The in-memory logger
also retains at most 4,096 records and 8 MiB and exposes `shared_records`.
The current Runtime beta stores drain configuration as an immutable
copy-on-write generation. Each observation shares one generation pointer
instead of cloning as many as 32 drain handles, and callbacks still run after
the configuration lock is released.
`SharedObservationEvent::new` applies redaction and field limits once. The
in-memory hub forwards that immutable payload through
`ObservationSink::emit_shared`; the built-in memory, file and metric sinks avoid
deep copies, while existing owned-only sink implementations use the compatible
default automatically.

In the current Runtime beta, `FileObservationSink::flush` uses one 30-second
deadline for both admission to its bounded queue and the worker's durability
acknowledgement. `flush_timeout` accepts a smaller positive deadline. A full
queue or stalled worker returns `TimedOut`; a flush already queued may finish
safely after the caller's deadline.

Use it for generic operational signals. New service lifecycle code uses
`appcore-supervisor` directly. Do not add vendor SDK lock-in or application
business metrics to the Runtime crate.

**Maturity:** stable operational primitives; production export/collection is
deployment-owned.
