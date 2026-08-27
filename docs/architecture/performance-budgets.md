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
- file outbox enqueue, read and acknowledgement near 1, 10 and 64 MiB, plus
  complete-snapshot versus bounded-page materialization over 256 messages;
- Gateway routing-state contention with 1, 100 and 1,000 tenants, plus a
  cross-tenant lock-independence probe;
- 32 sequential HTTP/1.1 exchanges through one accepted keep-alive connection;
- Peer RPC JSON/base64 and binary/native encode, decode, integrity and replay
  validation from 1 KiB to 4 MiB, plus 4,096 typed V2 rejection round trips;
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

AC-020 adds the `1.0.2-rc` Gateway telemetry contract. The gate retains 128
capability series, aggregates eight further names into one fixed overflow
series, runs 4,096 instrumented unavailable-worker routes and builds 256
snapshots. It requires zero residual inflight routes, exact cardinality and
overflow, route p99 no greater than 1 ms and snapshot p99 no greater than 5 ms.
The clean macOS/aarch64 run at implementation commit `31c4fbe` measured 1,792
ns route p99 and 5,792 ns snapshot p99. Export is an explicit deployment-owned
pull boundary and is never invoked from routing.

AC-021 validates the full typed-error matrix, exact V1 decoding and 4,096 V2
rejection encode/decode/validation round trips. The gate requires at most 1 ms
p99 and at least 1,000 operations/s. The clean macOS/aarch64 run at `d11befe`
measured 750 ns p99 and 1,405,708 operations/s with 298,672 KiB whole-suite
peak RSS. Linux and Windows CI artifacts remain the platform authority.

Track the remaining platform evidence in [public AC-021](https://github.com/dnettoRaw/app-core-public/issues/23).

AC-012 replaces process-random capability selection with stable
`FirstAvailable`, `RoundRobin`, `LeastInflight`, `HealthWeighted` and stateless
`Affinity` policies. The gate registers 64 workers, requires exactly four
round-robin selections per worker, verifies health, capacity and affinity
invariants, and executes 16,384 selections per measured policy. Each policy is
capped at 1 ms p99 and must exceed 10,000 selections/s. The final clean
macOS/aarch64 run at `7caddc1` measured 17,125 ns round-robin p99, 18,542 ns
least-inflight p99 and 38,083 ns affinity p99.

AC-013 adds 4,096 shared-registry lookups and three complete recovery rounds
at 1, 100 and 1,000 tenants, then 64 successful requests through each real
local fenced and authenticated V2 federated route. Lookup is capped at 5 ms
p99 and must exceed 500/s; recovery is capped at 5 s; local routing is capped
at 50 ms p99 and 100/s; federation at 250 ms p99 and 20/s. The clean
macOS/aarch64 run at `7197416` measured at most 667 ns lookup p99, 2.25 ms
recovery p99, 0.35 ms local-route p99 and 0.91 ms federated-route p99. Redis,
external-proxy and owner-loss tests remain separate evidence; Linux and
Windows artifacts remain required.

AC-014 adds an explicit opt-in binary representation for the existing V2 Peer
RPC DTOs while preserving the exact JSON/base64 fixtures and all V1 routes.
The gate requires binary body bytes to stay at or below 80% of JSON, binary
codec p99 not to exceed JSON and the bounded codec buffer to stay at or below
90% of JSON. The clean macOS/aarch64 run at `6f3bc38` measured 25% fewer body
bytes, 93% lower codec p99 and a 14% smaller buffer from 64 KiB through 4 MiB;
whole-suite peak RSS was 306,448 KiB. Missing binary support fails without a
JSON retry. Linux and Windows artifacts remain required.

AC-015 adds count/byte-bounded outbox pages, payload-free stats, durable retry
readiness and exact partial receipts. The Runtime follower and CLI no longer
materialize the complete queue. The clean macOS/aarch64 run at `c904e83`
materialized 460,684 bytes for a seven-message page versus 30,021,820 bytes for
the complete 256-message snapshot, a 98.46% reduction. Page p99 was 71,458 ns
versus 1,404,417 ns; stats p99 was 54,542 ns and whole-suite peak RSS was
244,752 KiB. The V1 peer wire remains unchanged; Linux and Windows artifacts
remain required.

Follow the benchmark in [public AC-022](https://github.com/dnettoRaw/app-core-public/issues/24)
and the command correction in [public AC-001](https://github.com/dnettoRaw/app-core-public/issues/3).
The query correction is tracked in [public AC-002](https://github.com/dnettoRaw/app-core-public/issues/4).
The Gateway correction is tracked in [public AC-003](https://github.com/dnettoRaw/app-core-public/issues/5).
Pending-request ownership is tracked in [public AC-004](https://github.com/dnettoRaw/app-core-public/issues/6).
HTTP connection reuse is tracked in [public AC-005](https://github.com/dnettoRaw/app-core-public/issues/7).
The outbox journal correction is tracked in [public AC-007](https://github.com/dnettoRaw/app-core-public/issues/9).
Direct worker indexing is tracked in [public AC-011](https://github.com/dnettoRaw/app-core-public/issues/13).
The fixed scheduler pool is tracked in [public AC-018](https://github.com/dnettoRaw/app-core-public/issues/20).
Bounded Gateway telemetry is tracked in [public AC-020](https://github.com/dnettoRaw/app-core-public/issues/22).
Bounded worker selection is tracked in [public AC-012](https://github.com/dnettoRaw/app-core-public/issues/14).
Gateway HA is tracked in [public AC-013](https://github.com/dnettoRaw/app-core-public/issues/15).
Binary Peer RPC framing is tracked in [public AC-014](https://github.com/dnettoRaw/app-core-public/issues/16).
Bounded outbox paging is tracked in [public AC-015](https://github.com/dnettoRaw/app-core-public/issues/17).
