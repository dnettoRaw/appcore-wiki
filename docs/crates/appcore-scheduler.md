---
title: appcore-scheduler
sidebar_position: 14
---

# appcore-scheduler

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-scheduler/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-scheduler/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-scheduler)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** bounded local task execution and explainable Core placement.

**Internal dependencies:** `appcore-contracts`, `appcore-core`.

**Primary API:** `Scheduler`, `SchedulerConfig`, `ScheduledTask`,
`TaskSchedule`, task callback/context/result, retry policy, handle and
snapshots; resource/placement requests, candidates, rejections, evaluations,
decisions and `PlacementEngine`.

Use it for Runtime or manifest-declared local work with explicit limits,
cancellation and shutdown. It is not a durable workflow engine or distributed
queue.

Shutdown closes admission while holding scheduler state, and deadline
arithmetic is checked. Unrepresentable one-shot, interval or retry times return
`InvalidSchedule` or remove the exhausted task instead of panicking.

**Maturity:** stable local profile; schedule state is process-local.
