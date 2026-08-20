---
title: appcore-ops
sidebar_position: 13
---

# appcore-ops

:::info Pacote publicado
Publicado **`1.0.1-rc.8`** · workspace atual do Runtime **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-ops/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-ops/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-ops)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-ops/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-ops/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-ops/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** health, logs, metrics, observations, heartbeat e
availability sem dependência de vendor.

**Dependências internas:** `appcore-core`, `appcore-supervisor`.

**API principal:** health status/report/checks, heartbeat sources, loggers,
metric counters, `ObservationEvent`/`ObservationSink`, file sink limitado,
availability report e reexports de compatibilidade para
`appcore-supervisor::managed_services`.

Use para sinais operacionais genéricos. Código novo de lifecycle usa
`appcore-supervisor` diretamente. Não adicione SDK de vendor nem métricas de
negócio da aplicação ao crate.

**Maturidade:** primitives RC estáveis; export/collection de produção pertence
ao deployment.
