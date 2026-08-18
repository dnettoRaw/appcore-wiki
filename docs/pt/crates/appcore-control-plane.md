---
title: appcore-control-plane
sidebar_position: 14
---

# appcore-control-plane

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-control-plane/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-control-plane/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-control-plane)
:::


**Responsabilidade:** implementações genéricas de presença, heartbeat, discovery
e leases.

**Dependências AppCore diretas:** `appcore-contracts`, `appcore-core`, `appcore-distributed-contracts`, `appcore-transport`.

**API principal:** clients in-memory, file e offline; configuração HTTP, retry
policy e transport trait; transports standard/bearer; coordinator e heartbeat
policy; guards de liderança global/serviço; validação de endpoint seguro.

Use para coordenação distribuída sem payload de negócio. Perfil file exige
locks/storage certificados. Perfil remoto exige TLS e autenticação do
deployment.

O perfil file limita estado e backup a 16 MiB e rejeita estado malformado ou
futuro. A aritmética de expiração e epoch é verificada; o esgotamento do epoch
falha fechado em vez de reutilizar um fencing token.

**Maturidade:** contratos e referências RC estáveis; operação do serviço
externo pertence ao deployment.
