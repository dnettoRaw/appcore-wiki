---
title: appcore-api
sidebar_position: 8
---

# appcore-api

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-api/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-api/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-api)
:::


**Responsibility:** Runtime HTTP command/query/status host and transport DTOs.

**Direct AppCore dependencies:** `appcore-core`, `appcore-security`, `appcore-supervisor`.

**Primary API:** `CommandRequest`/`CommandResponse`,
`QueryRequest`/`QueryResponse`, validation errors, `CommandEndpoint`,
`QueryEndpoint`, `ApiRouter`, generic `ApiRequest`/`ApiResponse`,
`RuntimeHttpHost`, `HttpApiConfig`, static status information, command
capability policy, token verification and sync-log view.

Use it to expose Runtime-owned routes and register application query behavior.
Do not add product REST resources or business schemas. New application hosting
normally reaches it through `appcore-bin`.

The configured payload bound applies to the complete HTTP body before Axum
deserializes JSON. Protected routes accept exactly one well-formed bearer
`Authorization` header; duplicates fail closed.

**Maturity:** stable strict HTTP V1 RC surface.
