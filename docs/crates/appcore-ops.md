---
title: appcore-ops
sidebar_position: 12
---

# appcore-ops

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-ops/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-ops/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-ops)
:::


**Responsibility:** vendor-neutral Runtime health, logging, metrics,
observations, heartbeat and availability.

**Direct AppCore dependencies:** `appcore-core`.

**Primary API:** health status/report/checks, heartbeat sources, log levels and
logger implementations, metric counters and in-memory metrics,
`ObservationEvent`/`ObservationSink`, bounded file sink and statistics, and
availability reports.

Use it for generic operational signals. Service lifecycle belongs to
`appcore-supervisor`; `appcore-ops` no longer exposes a second Supervisor or
compatibility aliases. Do not add vendor SDK lock-in or application business
metrics to the Runtime crate.

**Maturity:** stable RC operational primitives; production export/collection is
deployment-owned.
