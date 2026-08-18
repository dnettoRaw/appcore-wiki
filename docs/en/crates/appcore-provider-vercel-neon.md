---
title: appcore-provider-vercel-neon
sidebar_position: 19
---

# appcore-provider-vercel-neon

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-provider-vercel-neon/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-provider-vercel-neon)
:::


**Responsibility:** isolated official factory for the Vercel API control-plane
adapter backed by externally operated Neon coordination.

**Direct AppCore dependencies:** `appcore-contracts`, `appcore-control-plane`, `appcore-provider`.

**Primary API:** `VERCEL_NEON_PROVIDER_ID`, `AUTH_TOKEN_SECRET`, shared
control-plane client type and `VercelNeonControlPlaneFactory`.

Runtime nodes receive only the Vercel endpoint and an auth-token secret
reference. Neon credentials, schema operations, backup and retention stay in
the external service.

**Maturity:** supported RC adapter; production certification includes the
separately operated backend.
