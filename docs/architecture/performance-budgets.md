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
- Gateway routing-state contention with 1, 100 and 1,000 tenants, plus a
  cross-tenant lock-independence probe;
- 32 sequential HTTP/1.1 exchanges through one accepted keep-alive connection;
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
AC-002 also removes query endpoint execution from the host mutex and applies
the same four-of-eight gate. Its deterministic test freezes the registry and
requires all eight endpoint calls to overlap.

AC-003 replaces the public global Gateway tenant map with a bounded 32-shard
directory and one lock per tenant. The gate holds one tenant's write lock while
requiring another tenant's lock to remain available. Because keeping the old
map would restore serialization or duplicate mutable state, this correction is
reserved for the next SemVer major and the old field is removed.

AC-004 removes the process-global pending metadata mutex. One bounded private
map per tenant now stores the response channel, worker generation, deadline and
response-size limit in the same entry. Deterministic tests require cleanup after
response, invalid response, timeout, cancellation, shutdown, worker replacement
and disconnect, while a stale generation must leave the current entry intact.

AC-005 adds a reusable HTTP client with bounded per-origin admission, idle
ownership and origin retention. Connect/admission, read and write deadlines are
independent. Only fully framed and parsed responses return to the pool; any
failure or non-reusable response discards the socket. The gate requires all 32
exchanges to complete through one accepted connection. The V1 free `send`
adapter stays one-shot with `Connection: close`.

AC-007 replaces whole-file outbox reload/rewrite with the explicit V2
append-only journal for the next SemVer major. The 1/10/64 MiB workloads now
include a small incremental tail enqueue capped at 100 ms p99, while ACK is
capped at 500 ms p99. Atomic compaction changes the journal generation; tests
require incomplete final-frame recovery and fail-closed behavior for complete
corruption, duplicate/reordered frames and unsupported versions.

AC-011 adds direct per-tenant indexes by Core ID and `(cluster_id, core_id)`.
The gate performs 16,384 target lookups across the maximum 1,024 registered
workers and requires at most 1 ms p99, at least 10,000 lookups/s and zero index
inconsistencies. Reconnect, disconnect and heartbeat-prune tests require stale
generations never to remove the current entry.

AC-018 replaces scheduler thread-per-execution with a fixed pool and bounded
queue. The 64-task gate requires callback concurrency and distinct worker
thread names to remain within `max_concurrent_tasks`, while also observing at
least one bounded queue-saturation event. Excess work is deferred without
consuming retry attempts.

Follow the benchmark in [public AC-022](https://github.com/dnettoRaw/app-core-public/issues/24)
and the command correction in [public AC-001](https://github.com/dnettoRaw/app-core-public/issues/3).
The query correction is tracked in [public AC-002](https://github.com/dnettoRaw/app-core-public/issues/4).
The Gateway correction is tracked in [public AC-003](https://github.com/dnettoRaw/app-core-public/issues/5).
Pending-request ownership is tracked in [public AC-004](https://github.com/dnettoRaw/app-core-public/issues/6).
HTTP connection reuse is tracked in [public AC-005](https://github.com/dnettoRaw/app-core-public/issues/7).
The outbox journal correction is tracked in [public AC-007](https://github.com/dnettoRaw/app-core-public/issues/9).
Direct worker indexing is tracked in [public AC-011](https://github.com/dnettoRaw/app-core-public/issues/13).
The fixed scheduler pool is tracked in [public AC-018](https://github.com/dnettoRaw/app-core-public/issues/20).
