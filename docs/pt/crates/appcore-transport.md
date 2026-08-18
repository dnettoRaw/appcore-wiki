---
title: appcore-transport
sidebar_position: 3
---

# appcore-transport

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-transport)
:::


**Responsabilidade:** mecânica HTTP/TLS compartilhada e limitada.

**Dependências AppCore diretas:** Nenhuma.

**API principal:** `HttpScheme`, `HttpTarget`, `HttpRequest`, `HttpHeader`,
`HttpClientConfig`, `HttpResponse`, `CancellationToken`, `TransportError`,
`send`, parse de resposta e gzip limitado.

Use em adapters de infraestrutura que compartilham limites, timeout,
cancelamento e TLS. O consumidor mantém autenticação e policy. Não transforme
em framework web nem adicione endpoints de negócio.

O `Debug` de request/response mostra o tamanho do body, nunca seus bytes.
Headers conhecidos de credencial sao redigidos mesmo quando o chamador usa o
construtor de header nao sensivel.

**Maturidade:** superfície de infraestrutura RC estável.
