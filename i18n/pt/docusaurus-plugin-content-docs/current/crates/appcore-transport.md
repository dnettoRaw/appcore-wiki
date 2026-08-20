---
title: appcore-transport
sidebar_position: 4
---

# appcore-transport

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-transport)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-transport/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-transport/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-transport/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** mecânica HTTP/TLS compartilhada e limitada.

**Dependências internas:** nenhuma.

**Versionamento:** SemVer independente. O crate pode ser consumido sem qualquer
outro pacote AppCore.

**API principal:** `HttpScheme`, `HttpTarget`, `HttpRequest`, `HttpHeader`,
`HttpClientConfig`, `HttpResponse`, `CancellationToken`, `TransportError`,
`send`, parse de resposta e gzip limitado.

Use em adapters de infraestrutura que compartilham limites, timeout,
cancelamento e TLS. O consumidor mantém autenticação e policy. Não transforme
em framework web nem adicione endpoints de negócio.

O `Debug` de request/response mostra o tamanho do body, nunca seus bytes.
Headers conhecidos de credencial sao redigidos mesmo quando o chamador usa o
construtor de header nao sensivel.

**Maturidade:** superfície de infraestrutura estável.
