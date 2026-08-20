---
title: appcore-provider
sidebar_position: 19
---

# appcore-provider

:::info Published package
Published **`1.0.1-rc.8`** · current Runtime workspace **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-provider/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-provider)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-provider/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-provider/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-provider/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** implementation-neutral provider factories, registry,
deployment plans, coordination/job contracts and secret resolution.

**Internal dependencies:** `appcore-contracts`.

**Primary API:** `ProviderRole`, `ProviderContext`, `ProviderFactory`,
`ProviderRegistry`, `DeploymentProviderPlan`, provider errors/results,
zeroizing `ResolvedSecret` and `SecretProvider`; coordination schema V2,
in-memory/file coordination stores; shared-resource leases with fencing;
generic job spec/lease/completion/provider.

Filesystem leases use a per-resource lock file, an atomically replaced
versioned state file and a versioned epoch high-water sidecar. The sidecar is
persisted before publishing an active lease and survives release, restart and
interrupted acquisition, so an epoch is never reused. The epoch is a fencing token only
for writers that check it before writing. Shared filesystems that do not
provide reliable lock, rename, directory sync or cache-coherence semantics
cannot provide strong split-brain protection through this adapter alone.

Use it to compose explicit deployment providers. Do not register silent
fallbacks or put provider-specific SDK code in this crate.

**Maturity:** stable composition RC surface; distributed jobs remain outside the
first 1.0 operational profile.
