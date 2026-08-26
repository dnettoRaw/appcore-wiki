---
title: appcore-transport
sidebar_position: 4
---

# appcore-transport

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.0) · [código-fonte](https://github.com/dnettoRaw/app-core-public/tree/main/crates/appcore-transport)

Prerelease opcional **`1.1.0-alpha.1`** com client pooled e deadlines por
exchange: [crates.io](https://crates.io/crates/appcore-transport/1.1.0-alpha.1) ·
[docs.rs](https://docs.rs/crate/appcore-transport/1.1.0-alpha.1) ·
[código-fonte público](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-transport).
:::

## Guia e exemplos mantidos pelo crate

O repositório público mantém o [guia detalhado](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-transport/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-transport/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-transport/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** mecânica HTTP/TLS compartilhada e limitada.

**Dependências internas:** nenhuma.

**Versionamento:** SemVer independente. O crate pode ser consumido sem qualquer
outro pacote AppCore.

**API principal:** `HttpScheme`, `HttpTarget`, `HttpRequest`, `HttpHeader`,
`HttpClient`, `HttpExchangeConfig`, `HttpTimeouts`, `HttpPoolConfig`,
`HttpClientConfig`, `HttpResponse`, `CancellationToken`, `TransportError`,
`send`, parse de resposta e gzip limitado.

Mantenha e clone um `HttpClient` para compartilhar um pool limitado por scheme,
host e porta. Os deadlines de conexão/admissão, leitura e escrita são
independentes. Somente respostas totalmente delimitadas e interpretadas podem
ser reutilizadas; truncamento, framing inválido, timeout, cancelamento,
`Connection: close` e body delimitado por fechamento descartam o socket. A
função livre `send` continua sendo um adapter V1 one-shot e enviando
`Connection: close`.

Use em adapters de infraestrutura que compartilham limites, timeout,
cancelamento e TLS. O consumidor mantém autenticação e policy. Não transforme
em framework web nem adicione endpoints de negócio.

O `Debug` de request/response mostra o tamanho do body, nunca seus bytes.
Headers conhecidos de credencial sao redigidos mesmo quando o chamador usa o
construtor de header nao sensivel.

**Maturidade:** superfície de infraestrutura estável.
