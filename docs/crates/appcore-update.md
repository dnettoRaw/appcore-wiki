---
title: appcore-update
sidebar_position: 21
---

# appcore-update

:::info Published package
Published **`1.0.1-rc.8`** · current Runtime workspace **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-update/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-update/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-update)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-update/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-update/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-update/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

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

File reads are bounded and reject non-regular final components. Activation
revalidates staged size and SHA-256, then hard-links the staged file to an
immutable build path. An existing path is reused only when its bytes match the
descriptor exactly; it is never replaced. Atomic final-component no-follow is
implemented on Unix. Other platforms retain metadata checks but require their
deployment filesystem boundary to prevent reparse races.

**Maturity:** stable RC lifecycle; remote supply chains require signed
provenance and deployment trust roots.
