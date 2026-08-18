---
title: appcore-security
sidebar_position: 9
---

# appcore-security

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-security/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-security/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-security)
:::


**Responsibility:** reusable Runtime authentication, token, secret and policy
contracts.

**Direct AppCore dependencies:** `appcore-core`, `appcore-dnt`.

**Primary API:** HashToken provider, claims, command token factory/validator,
request hashing, `SecurityError`; secret references, resolvers, stores,
zeroizing bytes, file keyring, secret metadata/rotation format, Vault contract,
peer credentials, DNT key-provider adapter, authentication and policy traits.

Use it for infrastructure authentication and secret indirection. Tokens are
signed, not encrypted. Do not place domain authorization, OAuth servers,
inbound TLS or a managed vault implementation here.

The 1.0 RC has no TPM or hardware-backed provider. ADR 0005 records an additive
1.1 proposal with explicit fallback and physical-hardware evidence; the current
Runtime makes no hardware-security claim.

**Maturity:** stable RC contracts; production suitability depends on selected
secret backend and deployment controls.
