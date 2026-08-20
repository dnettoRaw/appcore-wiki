---
title: appcore-provider-vercel-neon
sidebar_position: 20
---

# appcore-provider-vercel-neon

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-provider-vercel-neon/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-provider-vercel-neon)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider-vercel-neon/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider-vercel-neon/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider-vercel-neon/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** factory oficial isolada do adapter Vercel API com
coordenação Neon operada externamente.

**Dependências internas:** contracts, control plane e provider.

**API principal:** `VERCEL_NEON_PROVIDER_ID`, `AUTH_TOKEN_SECRET`, tipo shared
do client e `VercelNeonControlPlaneFactory`.

Nodes recebem somente endpoint Vercel e referência do auth token. Credenciais,
schema, backup e retention Neon ficam no serviço externo.

**Maturidade:** adapter suportado; certificação inclui o backend separado.
