---
title: appcore-sync-sqlite
sidebar_position: 23
---

# appcore-sync-sqlite

:::warning Development preview
Post-1.0 **`0.1.0-alpha.1`** · not published · not selectable by the frozen V1
manifest or registered by `appcore-bin`.
:::

**Responsibility:** optional bounded SQLite persistence for Runtime-owned sync
state. It implements replication log, outbox and checkpoint contracts and owns
opaque tombstones, portable snapshot restore, integrity inspection and online
backup. It exposes neither arbitrary SQL nor application schemas.

**Direct AppCore dependencies:** `appcore-sync`, `appcore-storage`.

Crate-owned documentation is maintained as `guide.en.md`, `basic.en.md` and
`intermediate.en.md`. Public source links will replace these identifiers after
the prerelease is published.

The provider uses a fixed internal schema V1, WAL, `synchronous=FULL`, a
bounded connection pool and SQLite runtime limits. Unknown, removed or future
schemas fail with `NO MORE SUPPORTED PLEASE UPDATE`. Backup and restore publish
only verified new files; restore never replaces a live database.

Its declared storage guarantees are transactions, locking, snapshot, online
backup and multi-process operation on one local filesystem. Streaming,
multi-host operation and network shares are not claimed.

## Certified bounds

Clean-source release certification at `0f6f6d0` passed on macOS arm64 with
Rust 1.97.1. With 2,048 durable 1 KiB appends and 2,048 point reads, append p99
was 1.086 ms at 3,729 operations/s and read p99 was 0.583 ms at 6,578
operations/s. A verified 3,182,592-byte online backup took 73.870 ms; the full
integrity scan took 15.675 ms. All 14 conformance tests also passed on Linux
arm64 and amd64; Windows GNU cross-check and Clippy passed.

Publication requires coordinated prerelease versions of the unpublished
post-1.0 `appcore-sync` and `appcore-storage` contracts. The source mirror and
registry links will be added only after that release exists.
