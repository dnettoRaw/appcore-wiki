---
title: appcore-provider-vercel-neon
sidebar_position: 19
---

# appcore-provider-vercel-neon

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-provider-vercel-neon/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-provider-vercel-neon)
:::


**Responsabilidade:** factory oficial isolada do adapter Vercel API com
coordenação Neon operada externamente.

**Dependências AppCore diretas:** `appcore-contracts`, `appcore-control-plane`, `appcore-provider`.

**API principal:** `VERCEL_NEON_PROVIDER_ID`, `AUTH_TOKEN_SECRET`, tipo shared
do client e `VercelNeonControlPlaneFactory`.

Nodes recebem somente endpoint Vercel e referência do auth token. Credenciais,
schema, backup e retention Neon ficam no serviço externo.

**Maturidade:** adapter RC suportado; certificação inclui o backend separado.
