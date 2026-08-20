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

**Maturity:** stable contracts; file provider certified for one local process
and a filesystem with required lock/sync/rename semantics.
