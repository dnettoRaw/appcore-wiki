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

Use it for generic operational signals. New service lifecycle code uses
`appcore-supervisor` directly. Do not add vendor SDK lock-in or application
business metrics to the Runtime crate.

**Maturity:** stable operational primitives; production export/collection is
deployment-owned.
