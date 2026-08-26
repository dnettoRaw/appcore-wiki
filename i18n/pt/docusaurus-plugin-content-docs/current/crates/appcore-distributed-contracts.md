---
title: appcore-distributed-contracts
sidebar_position: 6
---

# appcore-distributed-contracts

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-distributed-contracts/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-distributed-contracts/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-distributed-contracts)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-distributed-contracts/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** contratos wire/provider versionados de control plane e
peer RPC.

**Dependências internas:** `appcore-contracts`, `appcore-types`.

**API principal:** constantes e paths do protocolo, registration, presence,
heartbeat, peer directory, leases de compatibilidade, leases por serviço,
leadership decisions e traits; paths peer, envelopes, responses, errors, call
kinds, advertisement DTOs, client executor e metadados de transporte para
content-envelope opaco.

Implementações pertencem aos crates de control plane ou peer. Não adicione
cliente HTTP, filesystem, tokens ou regras de capability de produto.

A serializacao wire de opaque-content e Peer RPC nao muda. O `Debug` mostra
tamanhos e metadata de roteamento, sem bytes de payload opaco, valores de
nonce/idempotencia ou detalhes de erro remoto.

**Maturidade:** contrato wire V1 estável e compatibilidade estrita.

## Frames chunked do Peer RPC V2

O módulo pós-1.0 `peer_rpc::v2` define uma família explícita de frames
open/chunk/commit/cancel. Open vincula bytes decodificados agregados,
tamanho/quantidade de chunks e deadline; cada chunk vincula sequência, tamanho
decodificado exato e digest; commit vincula o digest do payload decodificado
completo. V1 e V2 permanecem em módulos e rotas separados, sem detecção,
conversão ou fallback.

:::warning Contrato em desenvolvimento
Os DTOs V2 e o codec incremental estão implementados, mas ownership de sessão
HTTP assinada e streaming de resposta ainda devem passar AC-006 antes da
publicação. Continue usando rotas V1 explícitas até o anúncio dessa release.
:::
