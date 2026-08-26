---
title: Performance Budgets
sidebar_position: 8
---

# Performance Budgets

AppCore keeps a reproducible cross-subsystem benchmark so concurrency and
persistence corrections are measured against the same V1 workloads.

```bash
appcore-dev cert bottlenecks
```

The release-profile command writes
`builds/certification/bottlenecks.json`. The report records the exact source
commit, dirty state, toolchain, OS, architecture, p50/p95/p99, throughput, wall
time and peak resident memory. Linux and Windows CI execute the same gate and
publish the JSON artifact.

## Fixed workloads

- manifest-first startup plus concurrent command and query dispatch;
- file outbox enqueue, read and acknowledgement near 1, 10 and 64 MiB;
- Gateway routing-state contention with 1, 100 and 1,000 tenants;
- Peer RPC encode, decode, integrity and replay validation from 1 KiB to 4 MiB;
- scheduler startup and bounded batches of 64 due tasks.

The fixtures contain no static secret. Every run obtains temporary secret
material from the operating system random source.

## How budgets are used

Portable ceilings prevent regressions on shared CI runners. They are not
production performance claims. Each bottleneck correction must preserve V1,
show a before/after report, add a behavior invariant and tighten the affected
budget when the result is stable.

The initial baseline recorded maximum handler concurrency of `1` for both
commands and queries. AC-001 removes command-handler execution from the shared
host mutex. The gate now requires at least four of eight command workers to
overlap; deterministic tests require all eight to enter together, preserve
single execution for a matching idempotency key and verify shutdown drain.
Query serialization remains tracked separately by AC-002.

Follow the benchmark in [public AC-022](https://github.com/dnettoRaw/app-core-public/issues/24)
and the command correction in [public AC-001](https://github.com/dnettoRaw/app-core-public/issues/3).
