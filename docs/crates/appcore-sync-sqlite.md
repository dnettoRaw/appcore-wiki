---
title: appcore-sync-sqlite
sidebar_position: 23
---

# appcore-sync-sqlite

:::warning Published alpha
Post-1.0 **`0.1.0-alpha.2`** ·
[crates.io](https://crates.io/crates/appcore-sync-sqlite/0.1.0-alpha.2) ·
[docs.rs](https://docs.rs/crate/appcore-sync-sqlite/0.1.0-alpha.2) ·
[public source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-sync-sqlite) ·
not selectable by the stable V1 manifest.
:::

**Responsibility:** optional bounded SQLite persistence for Runtime-owned sync
state. It implements replication log, outbox and checkpoint contracts and owns
opaque tombstones, portable snapshot restore, integrity inspection and online
backup. It exposes neither arbitrary SQL nor application schemas.

**Direct AppCore dependencies:** `appcore-sync`, `appcore-storage`.

Crate-owned documentation is available as the
[guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/guide.en.md),
[basic example](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/examples/basic.en.md) and
[intermediate example](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/examples/intermediate.en.md),
with Portuguese and French variants beside them.

The provider uses transactional internal schema V2, WAL, `synchronous=FULL`, a
bounded connection pool and SQLite runtime limits. Unknown, removed or future
schemas fail with `NO MORE SUPPORTED PLEASE UPDATE`. Backup and restore publish
only verified new files; restore never replaces a live database.

Outbox enqueue computes the exact canonical JSON size and writes directly to an
incremental SQLite BLOB. Duplicate checks, page reads and startup integrity
validation also stream BLOB content, avoiding an additional encoded
record-sized `Vec<u8>` beside the owned message. Read and write scratch follows
the encoded size with fixed 64 KiB and 1 MiB ceilings, so small records do not
reserve maximum buffers.

Its declared storage guarantees are transactions, locking, snapshot, online
backup and multi-process operation on one local filesystem. Streaming,
multi-host operation and network shares are not claimed.

:::warning Next prerelease schema update
The development branch advances the internal database to schema V2. It adds
bounded attempt counters and readiness timestamps; page metadata is selected
before reading BLOBs, stats contain no payload, and exact partial receipts are
transactional. A known schema V1 database migrates atomically. Unknown and
future schemas still hit the update wall; rollback requires the verified
pre-migration backup.

Portable snapshot creation now moves database payloads into the snapshot.
Restore validates and inserts through shared references, and rejects aggregate
payload bytes above the configured database budget before deleting existing
rows. A 32 MiB Apple M1 workload reduced p50 from 466.80 to 396.00 ms and peak
RSS from 108.97 to 73.84 MiB by removing two temporary payload replicas.
:::

## Certified bounds

Clean-source release certification at `0f6f6d0` passed on macOS arm64 with
Rust 1.97.1. With 2,048 durable 1 KiB appends and 2,048 point reads, append p99
was 1.086 ms at 3,729 operations/s and read p99 was 0.583 ms at 6,578
operations/s. A verified 3,182,592-byte online backup took 73.870 ms; the full
integrity scan took 15.675 ms. All 14 conformance tests also passed on Linux
arm64 and amd64; Windows GNU cross-check and Clippy passed.

The current certification isolates seven SQLite allocation phases. In 512
small-record enqueues, the provider requested 255,676 Rust heap bytes with no
retained growth and measured 141,791 ns p99, below explicit 2 MiB and 250 ms
gates. Right-sized BLOB scratch reduced requested bytes for the full SQLite
workload from 578,081,344 to 8,251,670 (-98.57%) and peak live-heap delta from
1,083,528 to 233,600 bytes (-78.44%).

The provider uses the coordinated `appcore-sync` and `appcore-storage`
`2.0.0-alpha.1` contracts. Stable `1.0.0` applications do not select it
implicitly; adoption is an explicit prerelease choice.
