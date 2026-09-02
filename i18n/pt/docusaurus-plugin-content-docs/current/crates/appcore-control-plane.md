---
title: appcore-control-plane
sidebar_position: 15
---

# appcore-control-plane

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-control-plane/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-control-plane/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-control-plane)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-control-plane/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-control-plane/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-control-plane/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** implementações genéricas de presença, heartbeat, discovery
e leases.

**Dependências internas:** contracts, core, distributed contracts e transport.

**API principal:** clients in-memory, file e offline; configuração HTTP, retry
policy e transport trait; transports one-shot standard, pooled e bearer;
coordinator e heartbeat policy; guards de liderança global/serviço; validação
de endpoint seguro.

Use `PooledHttpTransport` para chamadas reutilizáveis sem autenticação.
`BearerHttpTransport` também possui um cliente reutilizável e limitado.
Mantenha `StdHttpTransport` somente onde o comportamento V1 one-shot com
`Connection: close` for necessário.

Use para coordenação distribuída sem payload de negócio. Perfil file exige
locks/storage certificados. Perfil remoto exige TLS e autenticação do
deployment.

O perfil file limita estado e backup a 16 MiB e rejeita estado malformado ou
futuro. A aritmética de expiração e epoch é verificada; o esgotamento do epoch
falha fechado em vez de reutilizar um fencing token.

`InMemoryControlPlane` usa por padrão 65.536 registros/slots de lease combinados
e orçamento estimado de 16 MiB retidos. `with_limits` pode reduzir ambos;
`stats` expõe bytes atuais/de pico, contagens e admissões rejeitadas. A rejeição
é atômica, então um registro existente continua utilizável. O estado em arquivo
preserva a fronteira JSON V1 de 16 MiB e também limita o estado decodificado a
262.144 registros e 64 MiB.

**Maturidade:** contratos e referências estáveis; operação do serviço
externo pertence ao deployment.
