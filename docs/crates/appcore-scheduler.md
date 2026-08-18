---
title: appcore-scheduler
sidebar_position: 13
---

# appcore-scheduler

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-scheduler/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-scheduler/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-scheduler)
:::


**Responsibility:** bounded local task execution and explainable Core placement.

**Direct AppCore dependencies:** `appcore-contracts`, `appcore-core`.

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

**Maturity:** stable local RC profile; schedule state is process-local.
