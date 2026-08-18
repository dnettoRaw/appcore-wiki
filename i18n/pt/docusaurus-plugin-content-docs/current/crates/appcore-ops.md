---
title: appcore-ops
sidebar_position: 12
---

# appcore-ops

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-ops/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-ops/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-ops)
:::


**Responsabilidade:** health, logs, metrics, observations, heartbeat e
availability sem dependência de vendor.

**Dependência AppCore direta:** `appcore-core`.

**API principal:** health status/report/checks, heartbeat sources, loggers,
metric counters, `ObservationEvent`/`ObservationSink`, file sink limitado e
availability reports.

Use para sinais operacionais genéricos. Lifecycle de serviços pertence ao
`appcore-supervisor`; `appcore-ops` não expõe mais um segundo Supervisor nem
aliases de compatibilidade. Não adicione SDK de vendor nem métricas de negócio
da aplicação ao crate.

**Maturidade:** primitives RC estáveis; export/collection de produção pertence
ao deployment.
