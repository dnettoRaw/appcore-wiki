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

O `BoundedReplayStore` local ao processo valida cada nonce no teto de 128 bytes,
limita entradas vivas e bytes retidos estimados e nunca aceita teto padrão
superior a 32 MiB. O operador pode escolher um teto menor e consultar bytes
atuais, pico, máximo e rejeições sem expor valores de nonce.

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

JSON continua sendo o default V2. Framing binário exige
`with_v2_binary_codec()` no host e
`with_stream_codec_v2(PeerRpcStreamCodecV2::Binary)` no client. Paths separados
de query/command exigem o media type Postcard exato e vinculam o token ao body
binário exato. Bodies binários nunca usam gzip HTTP; limites decodificados,
gzip opcional de chunk e hashes de integridade não mudam. Suporte binário
ausente ou incompatível é terminal e nunca faz fallback para JSON.

## Rejeições V2 tipadas

O candidato `appcore-peer-rpc 1.0.2-rc` consome `PeerRpcWireErrorV2` dos endpoints
explícitos de `appcore-distributed-contracts 1.0.2-rc`. O code determina
phase e retryability; retry delay é limitado a
300 segundos, correlation a 128 bytes e a mensagem redigida controlada pelo
protocolo a 256 bytes. O client rejeita metadata conhecida contraditória. Code
desconhecido descarta mensagem/hint remotos e vira um único resultado
observável e terminal `unknown`.

Responses V1 estáveis preservam o JSON existente. O client mapeia apenas
codes exatos do host para `PeerRpcError::RemoteRejected`; somente rejeições
exatas de endpoint/capacidade de replay entram no retry limitado existente.
Nenhuma substring ou mensagem livre controla retry. Ambiguidade do ACK de um
frame V2 ainda proíbe retry automático do frame.

:::warning Atualize em conjunto e mantenha V1 explícito
Atualize caller e target antes de selecionar o endpoint V2. V1 estável continua
suportado para deployments legacy e nunca é atualizado, convertido ou
desabilitado automaticamente.
:::

A certificação release clean-source em `6f3bc38` mediu 25% menos bytes de body,
93% menos p99 de codec e buffer limitado 14% menor entre 64 KiB e 4 MiB. O caso
de 1 KiB melhorou 38%/65%/18%; o RSS máximo da suíte foi 306.448 KiB.
`/v1/peer/*` interpreta somente V1 e nunca infere V2. O codec binário continua
em desenvolvimento até existir evidência Linux/Windows.
