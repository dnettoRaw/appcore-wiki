---
title: appcore-supervisor
sidebar_position: 4
---

# appcore-supervisor

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-supervisor/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-supervisor/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-supervisor)
:::


**Responsibility:** dependency-aware lifecycle, health, restart budgets and
shutdown for Runtime-owned managed services.

**Direct AppCore dependencies:** None.

**Primary API:** `ManagedService`, `ServiceDescriptor`, `ServiceDependency`,
`DependencyRequirement`, `Supervisor`, `SupervisorWatchdog`, `RestartPolicy`,
`RestartState`, `ServiceHealth`, `ServiceActivationState`,
`ServiceRuntimeState`, typed snapshots/events, and adapters.

Use it in a composition root to manage Scheduler, Peer RPC, Control Plane,
Jobs, Update, Auth Server, Metrics, Observation, Sync, workers and queues. Do
not use it to restart its own host process. Reconcile only schedules restart
work. A bounded executor performs lifecycle actions while an independent
watchdog verifies progress.

No second Supervisor module or alias surface exists in `appcore-ops`.

Managed callback, factory and health-probe panics become controlled failed
states; a panic in one restart job does not terminate the bounded worker.
Timeout arithmetic and pending counters are checked. Shutdown is cooperative,
so an arbitrary callback that ignores cancellation cannot be forcibly stopped
safely in-process.

**Maturity:** evolving stable contract with bounded events, queue, workers,
budgets and diagnostics; deployment process supervision remains external.
