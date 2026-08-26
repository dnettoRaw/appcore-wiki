---
title: appcore-peer-rpc
sidebar_position: 17
---

# appcore-peer-rpc

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-peer-rpc/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-peer-rpc/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-peer-rpc)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** client peer autenticado, host HTTP, validação e replay
protection.

**Dependências internas:** core, distributed contracts, security e transport.

**API principal:** traits de token issuer/authenticator/dispatcher e
implementações HashToken/static; nonce stores memória/arquivo; config,
validator e hashes; retry/client config e transport trait; transportes pooled e
standard one-shot; HTTP state e host.

Use `PooledPeerRpcTransport` para reutilizar conexões limitadas por origem.
`StdPeerRpcTransport` preserva o comportamento V1 one-shot com
`Connection: close`.

Use somente quando tenant, cluster, source, target, protocolo, expiry, nonce e
integridade podem ser provados. `AllowPeerAuthenticator` é somente teste.

O `Debug` dos DTOs peer request, response, outbound e HTTP mostra tamanhos e
omite bytes opacos, credenciais, valores de nonce/idempotencia e detalhes de
erro remoto.

**Maturidade:** superfície peer V1 estável.

## Codec V2 limitado

`PeerRpcChunkEncoder` e `PeerRpcChunkAssembler` processam um stream V2
explicitamente selecionado usando um chunk limitado por vez. Os limites default
são 64 KiB decodificados por chunk, 96 KiB codificados, 64 MiB agregados e
1.024 chunks. Bytes codificados usam string JSON base64 canônica, nunca array de
inteiros. Sequência, tamanho decodificado exato, SHA-256 por chunk e total,
deadline, cancelamento e quota após gzip falham fechados. Commit com falha nunca
expõe o sink parcial como completo.

`PeerRpcStreamRegistry` controla sessões parciais com quotas exatas de sessões
e bytes decodificados. Chunks de requisição usam arquivos exclusivos em um
diretório de spool existente acessível somente pelo proprietário; apenas
commits verificados chegam ao dispatcher e respostas usam pulls explícitos e
limitados. Erro, cancelamento, expiração e conclusão liberam arquivo e reserva.
O snapshot expõe sessões, bytes reservados, saturações e limpezas.
Unix valida o proprietário efetivo e modos `0700`/`0600` do diretório/arquivo.
Windows rejeita reparse points e todo allow ACE fora do SID proprietário do
processo atual. Outras plataformas falham fechadas ao construir o registry.

Habilite as rotas HTTP assinadas somente com
`PeerRpcHttpHost::with_v2_stream_registry`; o host default continua V1-only.
`query_stream_v2` e `command_stream_v2` vinculam cada body JSON exato a um
bearer token e movem request/response um frame por vez. A admissão do open
verifica tenant, cluster, target, trace, deadline, idempotência de command e
nonce replay limitado. Frames ambíguos não são repetidos; cancelamento best
effort é respaldado pela limpeza autoritativa por deadline.

A certificação release clean-source em `8d26cc3` passou com payload
incompressível de 64 MiB, 1.024 chunks, maior frame JSON de 87.660 bytes, p99 de
1,092 segundo e pico RSS da suíte de 366.432 KiB. Essa API não negocia
transporte. `/v1/peer/*` interpreta somente V1 e nunca infere V2. V2 está
publicado apenas na linha opt-in `2.0.0-alpha.1`.
