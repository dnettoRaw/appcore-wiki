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

Follow the benchmark in [public AC-022](https://github.com/dnettoRaw/app-core-public/issues/24)
and the command correction in [public AC-001](https://github.com/dnettoRaw/app-core-public/issues/3).
The query correction is tracked in [public AC-002](https://github.com/dnettoRaw/app-core-public/issues/4).
The Gateway correction is tracked in [public AC-003](https://github.com/dnettoRaw/app-core-public/issues/5).
Pending-request ownership is tracked in [public AC-004](https://github.com/dnettoRaw/app-core-public/issues/6).
HTTP connection reuse is tracked in [public AC-005](https://github.com/dnettoRaw/app-core-public/issues/7).
