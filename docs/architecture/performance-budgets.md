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

The initial baseline records maximum handler concurrency of `1` for both
commands and queries. That is evidence of the known global serialization, not
the desired final behavior.

Follow the work in [public AC-022](https://github.com/dnettoRaw/app-core-public/issues/24).
