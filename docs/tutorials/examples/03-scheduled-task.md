---
title: 3. Scheduled Task
sidebar_position: 3
---

# 3. Scheduled Task

At this level the application owns a callback, while AppCore owns the scheduler
workers, concurrency, retry timing, panic isolation, cancellation, and
shutdown.

## Declare the requirement

Change the Application Manifest scheduler section:

```toml title="application.toml"
[scheduler]
required = true
max_concurrency = 1
```

If the manifest requires scheduling but business code registers no task,
bootstrap fails. The reverse mismatch also fails.

## Register one bounded task

Add these imports to the application facade import:

```rust
use appcore_bin::application::{
    ApplicationTaskRegistry, RetryPolicy, ScheduledTask, TaskSchedule,
};
use std::time::Duration;
```

Then add this method to `impl Application for EchoApplication`:

```rust
fn register_tasks(
    &self,
    registry: &mut ApplicationTaskRegistry,
) -> RuntimeResult<()> {
    registry.register(
        ScheduledTask {
            id: "example.maintenance".to_string(),
            schedule: TaskSchedule::Interval {
                every: Duration::from_secs(3_600),
                start_at: None,
            },
            retry: RetryPolicy::default(),
            priority: 1,
            trace: None,
        },
        |_context| {
            // Perform one bounded unit of application-owned work.
            Ok(())
        },
    )
}
```

`RetryPolicy::default()` performs one attempt. Use an explicit policy when a
retry is safe:

```rust
retry: RetryPolicy {
    max_attempts: 3,
    initial_backoff: Duration::from_secs(1),
    max_backoff: Duration::from_secs(30),
    multiplier: 2,
    jitter: Duration::from_millis(250),
},
```

The callback returns `Result<(), String>`. Keep it bounded and cooperative; do
not start a detached thread or an endless loop inside it.

## Verify Runtime ownership

The existing manifest-first test can inspect the service report:

```rust
let report = host
    .probe_services(Duration::from_secs(2))
    .expect("service probe");
assert!(report.scheduler_started);
```

Also test:

- `every = Duration::ZERO` is rejected;
- duplicate task IDs are rejected;
- retryable work is idempotent;
- shutdown prevents new admissions;
- a callback failure returns a controlled task failure.

## Do not use this as a workflow engine

The scheduler is process-local. Durable multi-step workflows, cross-service
transactions, and a distributed queue remain outside this profile.

Next: [run the same business code in cluster mode](./standalone-to-cluster).
