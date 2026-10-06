---
title: appcore-storage
sidebar_position: 11
---

# appcore-storage

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-storage/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-storage/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-storage)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-storage/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-storage/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-storage/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** generic storage contracts and the bounded local file
provider.

**Internal dependencies:** `appcore-contracts`, `appcore-dnt`,
`appcore-security`, `appcore-types`.

**Primary API:** `StorageProvider`, `Repository`, `Migration`, `Transaction`,
health/status/errors, validated repository and migration IDs,
`FileStorageProvider`, storage manifests, V1 backup manifest/descriptor,
authenticated remote storage request/response helpers, and optional DNT-backed
sealed object, snapshot and secret stores.

The sealed file adapter writes normal DNT by default and exposes
`DntFileObjectStore::write_object_compact` for compressible snapshots, backups
and exported domain files. Compact writes remain ordinary DNT envelopes over
the same file provider; they do not change the storage backend contract.
Sealed reads derive a complete-envelope bound from `SealedStoragePolicy` and
reject oversized files before allocating the file buffer.

Complete snapshots retain their bounded file inventory, but their 16 MiB V1
manifest no longer needs a complete encoded buffer beside it. Pretty JSON is
serialized directly through a bounded 16 KiB writer into an exclusive atomic
temporary and deserialized through a bounded 16 KiB reader. Exact-limit input
remains valid and one non-retained byte detects concurrent growth.

Use it when an application or Runtime service needs the documented local-first
storage profile. Keep domain schemas and tables outside. Unsupported
transactions fail explicitly.

Housekeeping and backup traversal is iterative and bounded and never follows
symbolic links or Windows reparse points. Backup listings use persisted
snapshot timestamps, with filesystem creation/modified metadata only for
single-file backups. Final file opens use platform no-follow semantics and are
revalidated under the process lock. The one-process profile still assumes an
owner-protected root: a hostile same-account process replacing an ancestor
directory during an operation remains outside this portable boundary.

Tree traversal visits at most 200,000 entries incrementally while retaining
only the bounded 16,384-directory work stack and consumer-owned results.
Snapshot creation keeps its required sorted file paths without a second global
entry list; health retains only a counter, cleanup only matching temporary
paths, and symlink validation no entries at all. The depth ceiling remains 128.
Snapshot verification also counts actual files incrementally and borrows the
previous manifest path while checking order; it does not build a second path
inventory or clone one path per entry.

## Post-1.0 capability preflight

`StorageCapabilityDescriptorV1` defines seven exact guarantees: transactions,
locking, snapshot, streaming, online backup, multi-process and multi-host. The
catalog is capped at 32 providers. Deployments opt in with
`required_capabilities`; `storage.shared=true` requires `multi_host`.
Unknown, duplicate or unsupported requirements fail before storage opens and
never select a weaker provider. The file provider advertises only `snapshot`.
The published V1 manifest shape is unchanged.

Clean-source certification at `12cbfc3` measured 83 ns p99 and 10,493,879
preflights/s under the fixed seven-capability and 32-provider bounds.

**Maturity:** stable contracts; file provider certified for one local process
and a filesystem with required lock/sync/rename semantics.

## Candidate bootstrap and individual atomic files

Additions available in `1.0.5-rc`: after blocking and draining writes, deployment
may call `authorize_candidate_bootstrap("candidate")` once. Reserve before
`seal_after_install_start`, then consume the authority with `run`. Its callback
receives a scoped `CandidateBootstrapPermit` with no clone/nesting/escape API.
Normal `open` remains rejected; success, error or panic leaves the barrier
sealed. Dropping unused authority revokes it. Deployment owns candidate
selection and filesystem permissions; this is process-local admission, not a
cross-process token, sandbox or filesystem authorization mechanism.

`AtomicFileWriter::new(absolute_path, max_bytes)?.write(bytes)` replaces one
file outside the managed root. Existing real parent directories are required;
symlinks/reparse points and traversal are rejected. The budget is 1 byte to
64 MiB, input is checked before staging, and exclusive sibling files are synced
before rename. Unix output uses mode 0600 and parent-directory sync; other
platforms retain the existing provider durability limits. Parent directories
must be deployment-protected. Concurrent writers are last-successful-rename
wins; this is not a transaction. A post-rename sync failure can leave new bytes
visible while reporting failure.

An application backup format needs an application-owned import bridge: bound
and authenticate/decrypt the original archive using its original codec, reject
unknown versions/unsafe paths, validate its inventory and stage verified opaque
files into a new provider snapshot. Validate the snapshot before switching
roots, preserve the old root for rollback and test interrupted imports. Do not
rename an old archive into a Runtime snapshot or add legacy parsers to AppCore.

## Published release

`1.0.5-rc` — published on crates.io; previously published versions remain immutable.

## Published package

[`appcore-storage 1.0.5-rc`](https://crates.io/crates/appcore-storage/1.0.5-rc) · [docs.rs](https://docs.rs/appcore-storage/1.0.5-rc) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-storage).
