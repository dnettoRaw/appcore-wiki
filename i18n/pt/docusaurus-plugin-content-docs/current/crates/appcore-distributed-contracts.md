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

`OpaqueEnvelopeDeduplicator` mantém uma alocação compartilhada por ID de
mensagem aceito entre os índices de membership e ordem FIFO. Resultado de
duplicata, eviction e API pública não mudam. Reter 65.536 IDs distintos de 128
bytes no Apple M1 reduziu p50 de 37,55 ms para 32,83 ms e RSS pico de 35,86 MiB
para 27,25 MiB. Validação de transporte e deduplicação rejeitam IDs vazios,
caracteres de controle e IDs acima de `MAX_OPAQUE_MESSAGE_ID_BYTES` (1.024
bytes UTF-8) antes da retenção.

**Maturidade:** contrato wire V1 estável e compatibilidade estrita.

## Frames chunked do Peer RPC V2

O módulo pós-1.0 `peer_rpc::v2` define uma família explícita de frames
open/chunk/commit/cancel. Open vincula bytes decodificados agregados,
tamanho/quantidade de chunks e deadline; cada chunk vincula sequência, tamanho
decodificado exato e digest; commit vincula o digest do payload decodificado
completo. Bytes codificados usam uma string JSON base64 canônica, não array de
inteiros. V1 e V2 permanecem em módulos e rotas separados, sem detecção,
conversão ou fallback.

A representação binária opt-in envolve os mesmos DTOs V2 com marcador fixo
`APCRPC2B`, versão do codec, tipo frame/reply e tamanho Postcard exato. Bytes de
chunk continuam nativos e todo encode/decode é limitado a 256 KiB. Fixtures
JSON não mudam. Mismatch de marcador, versão, tipo, tamanho ou codec falha antes
do dispatch e nunca seleciona outra representação.

:::warning Contrato alpha publicado
Os DTOs, codec, registro limitado e integração host/client assinada V2 passaram
na certificação release clean-source em `8d26cc3` e estão publicados em
`2.0.0-alpha.1`. Aplicações estáveis continuam usando rotas V1 explícitas; o
alpha permanece uma prerelease opt-in.
:::

## Erros tipados do Peer RPC V2

`PeerRpcWireErrorV2` adiciona `code`, `phase`, `retryable`,
`retry_after_ms`/`correlation_id` limitados e mensagem redigida controlada pelo
protocolo à família V2 explícita. Metadata conhecida é validada como uma única
matriz. Code desconhecido vira `unknown` terminal sem reter texto ou retry hint
remoto. `PeerRpcRemoteErrorV1` é um decoder exato separado para o campo string
V1 estável; ele não negocia nem cria tráfego V2.
