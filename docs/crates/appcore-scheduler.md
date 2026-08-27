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

Callbacks use a fixed pool capped by `max_concurrent_tasks` and a bounded
internal queue. Excess due work stays scheduled without consuming a retry;
`worker_thread_count`, `queued_task_count` and `queue_saturation_count` expose
the limit and pressure. Shutdown drains accepted callbacks with cooperative
cancellation; callbacks must check `TaskContext::is_cancelled()` because Rust
threads are not forcibly timed out.

## `1.0.2-rc`: opt-in recovery

The `1.0.2-rc` candidate implements the `SchedulerStateProvider` V1
boundary. `Scheduler::with_state_provider` selects a bounded owner, claim TTL,
clock-skew allowance and provider; `schedule_durable` opts individual tasks
into persisted next-run, attempt, misfire, fencing and receipt state. Existing
`Scheduler::new` and `schedule` calls remain ephemeral and offline.

The file provider combines same-process and interprocess locking with a
checksummed bounded V1 snapshot and atomic replacement. Claims are acquired
before dispatch and renewed while work runs. Callbacks receive
`TaskContext::fencing_epoch()` and must use it at the protected effect boundary
when owners can compete. Recovery remains at-least-once until the cycle receipt
commits; callbacks and business workflow data are never serialized.

This API is source status only. Do not infer that it is available from the
stable `1.0.0` package shown above.

:::warning Update recommended
Deploy the scheduler release containing AC-018 when it becomes available.
Earlier releases create a new operating-system thread per execution; that
legacy path is not retained alongside the bounded correction.
:::

**Maturity:** stable local profile; schedule state is process-local.
