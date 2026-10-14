---
title: appcore-update
sidebar_position: 21
---

# appcore-update

:::info Published package
Release candidate **`1.0.3-rc.2`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-update/1.0.3-rc.2) · [docs.rs](https://docs.rs/crate/appcore-update/1.0.3-rc.2) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/beta/crates/appcore-update)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-update/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-update/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-update/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** opaque application artifact selection, authenticity,
staging, activation, health gate and rollback.

**Internal dependencies:** contracts and provider.

**Primary API:** artifact descriptor and signing payload; authenticity verifier,
feature-gated unsigned-local and Ed25519 implementations, trust policy/key status; update
request/provider and file provider/factory; staged artifact, activation receipt
and file store; coordinator, preparation/outcome, health check and fault
injection contracts.

Use it for application binaries or opaque artifacts. The Runtime validates
identity, version, protocol, checksum and trust but never understands
application code or schema.

File reads preflight size before allocation, use a fixed 16 KiB scratch buffer
plus one non-retained sentinel byte, and reject non-regular final components.
Activation revalidates staged size and SHA-256, then hard-links the staged file
to an immutable build path. An existing path is reused only when its bytes
match the descriptor exactly; it is never replaced. Atomic final-component no-follow is
implemented on Unix. Other platforms retain metadata checks but require their
deployment filesystem boundary to prevent reparse races.

Active/previous pointers and pending activation receipts borrow their
descriptors, pass a non-retaining 1 MiB sizing check, and serialize directly to
the atomic temporary file through a fixed 16 KiB buffer. Their V1 JSON encoding
is unchanged. Reads also deserialize directly through a fixed 16 KiB bounded
reader instead of retaining a complete encoded byte vector beside the decoded
pointer or receipt. Missing files, I/O failures and decode failures remain
distinct so the pending-activation upgrade wall is preserved.

The file provider streams the bounded index once and retains only the best
semantic version and its descriptor. Each descriptor is validated and then
discarded or selected while the JSON array is decoded, so neither a descriptor
vector nor a sorted candidate list is retained. Equal versions preserve the
first index entry. A fixed 16 KiB reader, 1 MiB preflight and one non-retained
sentinel byte reject declared oversize and concurrent growth.

The release candidate also exposes a bounded `ReleaseCatalog` and streaming
artifact lookup, content-addressed cache primitives, and recovery V2 metadata.
`QuarantineStore` records failed candidates so selection can exclude them
without mutating the release catalog. The `appcore-update-diagnose` CLI reads
only bounded local state and emits redacted diagnostics for operators.

**Maturity:** release candidate lifecycle; remote supply chains require signed
provenance and deployment trust roots.

## Independent prerelease — 2026-10-14

`2.0.0-alpha.2`: source changes.

[crates.io](https://crates.io/crates/appcore-update/2.0.0-alpha.2) · [docs.rs](https://docs.rs/appcore-update/2.0.0-alpha.2)


The exhaustive public `UpdateError` enum adds `Transfer` and `Recovery` relative to stable 1.0.0. This Rust API change requires an explicit major prerelease; existing V1 manifests and update descriptor protocols remain unchanged. Migration: select `appcore-update = "=2.0.0-alpha.2"`, handle both new error variants, rerun activation/recovery/rollback tests, and preserve the preceding binary and verified data backup. Rollback: stop activation, restore the preceding binary and its verified compatible persisted-state backup; never infer or convert unsupported state. No major release is silently selected by a 1.x dependency requirement.
