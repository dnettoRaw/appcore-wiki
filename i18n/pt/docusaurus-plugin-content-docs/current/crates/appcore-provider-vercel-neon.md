---
title: appcore-provider-vercel-neon
sidebar_position: 20
---

# appcore-provider-vercel-neon

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-provider-vercel-neon/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-provider-vercel-neon)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-provider-vercel-neon/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-provider-vercel-neon/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-provider-vercel-neon/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** factory oficial isolada do adapter Vercel API com
coordenação Neon operada externamente.

**Dependências internas:** contracts, control plane e provider.

**API principal:** `VERCEL_NEON_PROVIDER_ID`, `AUTH_TOKEN_SECRET`, tipo shared
do client e `VercelNeonControlPlaneFactory`.

Nodes recebem somente endpoint Vercel e referência do auth token. Credenciais,
schema, backup e retention Neon ficam no serviço externo.

**Maturidade:** adapter suportado; certificação inclui o backend separado.

## Prerelease independente — 2026-10-14

`1.0.4-rc.2`: alinhamento de dependências.

[crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.4-rc.2) · [docs.rs](https://docs.rs/appcore-provider-vercel-neon/1.0.4-rc.2)

## Disponibilidade HA negociada — 1.0.4-rc.4

Esta coorte RC alinha os tipos distribuídos partilhados entre Sync, Peer RPC, control
plane, Gateway, Transfer, SQLite e SDK. `peer.availability.v1` seleciona resultados
autenticados e estruturados sem mudar os formatos V1. Busy não executa a closure nem
confirma trabalho. Rejeição, pendência, transporte e confirmação durável são distintos;
os retries preservam a identidade idempotente. A composição comprova a conclusão da
closure, o fencing e a confirmação exigida da réplica. Não implica migração de
instalações, deployment ou certificação de falha física de energia.

Consulte o [guia de disponibilidade](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-peer-rpc/wiki/guide.pt.md).
