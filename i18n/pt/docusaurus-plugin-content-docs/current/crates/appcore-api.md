---
title: appcore-api
sidebar_position: 8
---

# appcore-api

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-api/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-api/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-api)
:::


**Responsabilidade:** host HTTP de command/query/status e DTOs de transporte.

**Dependências AppCore diretas:** `appcore-core`, `appcore-security`, `appcore-supervisor`.

**API principal:** `CommandRequest`/`CommandResponse`,
`QueryRequest`/`QueryResponse`, validation errors, `CommandEndpoint`,
`QueryEndpoint`, `ApiRouter`, `ApiRequest`/`ApiResponse`, `RuntimeHttpHost`,
`HttpApiConfig`, status estático, policy de capability, verificação de token e
view do sync log.

Use para rotas do Runtime e queries registradas da aplicação. Não adicione
resources REST de produto ou schemas de negócio. O host novo normalmente
acessa pelo `appcore-bin`.

O limite configurado aplica-se ao corpo HTTP completo antes de o Axum
desserializar o JSON. Rotas protegidas aceitam exatamente um header
`Authorization` bearer bem formado; duplicatas falham de forma fechada.

**Maturidade:** superfície HTTP V1 RC estrita e estável.
