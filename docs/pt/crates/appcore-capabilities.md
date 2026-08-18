---
title: appcore-capabilities
sidebar_position: 15
---

# appcore-capabilities

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-capabilities/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-capabilities/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-capabilities)
:::


**Responsabilidade:** registrar handlers locais e resolver providers locais ou
remotos compatíveis.

**Dependências AppCore diretas:** `appcore-contracts`, `appcore-core`, `appcore-distributed-contracts`.

**API principal:** request/response/error, traits local handler e remote
invoker, local provider, registry, provider selection, resolution policy,
selection trait/default, resolver e invoker peer RPC.

Use IDs genéricos e requisitos explícitos. O resolver considera health, mode,
liderança e policy; não interpreta semântica de produto.

**Maturidade:** perfil de roteamento RC estável.
