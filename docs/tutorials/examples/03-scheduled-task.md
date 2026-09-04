---
title: 3. Scheduled Task Contract
sidebar_position: 3
---

# 3. Scheduled Task Contract

Enable `scheduler` only when the application registers bounded local work:

```toml title="Cargo.toml"
[dependencies]
appcore-sdk = { version = "1.0.0-rc.1", features = ["scheduler"] }
```

Implement `Application::register_tasks` with
`ApplicationTaskRegistry`, `ScheduledTask`, `TaskSchedule`, and an explicit
retry policy. The callback performs one bounded unit of work and returns a
controlled result.

The application owns the callback and task identity. The selected deployment
owns scheduler workers, concurrency, retry timing, cancellation, supervision,
and shutdown. Never start a detached thread or endless loop inside a callback.

Test duplicate identities, zero intervals, retry idempotency, admission during
shutdown, and callback failure. Durable multi-step workflows remain outside
the process-local scheduler profile.

Next: [change deployment mode without changing business code](./standalone-to-cluster).
