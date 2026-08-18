---
title: appcore-provider-vercel-neon
sidebar_position: 19
---

# appcore-provider-vercel-neon

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-provider-vercel-neon/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-provider-vercel-neon)
:::


**Responsabilité :** factory officielle isolée de l'adapter API Vercel avec
coordination Neon opérée extérieurement.

**Dépendances AppCore directes :** `appcore-contracts`, `appcore-control-plane`, `appcore-provider`.

**API principale :** `VERCEL_NEON_PROVIDER_ID`, `AUTH_TOKEN_SECRET`, type
partagé du client et `VercelNeonControlPlaneFactory`.

Les nodes reçoivent seulement endpoint Vercel et référence auth token. Les
credentials, schémas, backup et retention Neon restent dans le service externe.

**Maturité :** adapter RC supporté; certification incluant le backend séparé.
