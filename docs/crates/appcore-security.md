---
title: appcore-security
sidebar_position: 10
---

# appcore-security

:::info Published package
Release candidate **`1.0.3-rc.1`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-security/1.0.3-rc.1) · [docs.rs](https://docs.rs/crate/appcore-security/1.0.3-rc.1) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/beta/crates/appcore-security)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-security/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-security/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-security/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** reusable Runtime authentication, token, secret and policy
contracts.

**Internal dependencies:** `appcore-core`, `appcore-dnt`.

**Primary API:** HashToken provider, claims, command token factory/validator,
request hashing, `SecurityError`; secret references, resolvers, stores,
zeroizing bytes, file keyring, secret metadata/rotation format, Vault contract,
peer credentials, DNT key-provider adapter, authentication and policy traits.

Use it for infrastructure authentication and secret indirection. Tokens are
signed, not encrypted. Do not place domain authorization, OAuth servers,
inbound TLS or a managed vault implementation here.

`HashTokenProvider::from_secret`, `with_secret` and `with_material` return a
`SecurityResult` and enforce the same minimum secret and salt invariants.
`compute_request_hash` emits a `v2:` SHA-256 value over domain-separated,
length-framed fields with explicit optional-field presence. Earlier
unversioned hashes are rejected, so issuers and validators must upgrade
together.

`RequestValidationDetailsRef` and `RequestPayloadRef` provide an additive
borrowed path for in-flight requests. `compute_borrowed_request_hash` preserves
the exact V2 output while counting and hashing structured JSON directly in two
passes, without retaining a complete encoded payload. The owned contract stays
available for compatibility.

`CommandTokenValidator` centrally rejects future issue timestamps, invalid
timestamp ordering and claim lifetimes above `TokenClaims::ttl_ms`. Distinct
clocks may opt into at most five minutes of positive issue-time skew; expiry
remains strict.

`SecureDirectory` and its private-directory helpers provide a fail-closed
filesystem boundary for key material and other security-owned state. They
validate ancestors, reject traversal and symlink/reparse escapes, and support
pinned-handle operations where the platform permits them. They do not silently
repair permissions or turn deployment-owned policy into an implicit fallback.

AppCore 1.0 has no TPM or hardware-backed provider. ADR 0005 records an additive
1.1 proposal with explicit fallback and physical-hardware evidence; the current
Runtime makes no hardware-security claim.

**Maturity:** release candidate contracts; production suitability depends on
the selected secret backend and deployment controls.
