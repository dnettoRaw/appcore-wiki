---
title: appcore-scheduler
sidebar_position: 14
---

# appcore-scheduler

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-scheduler/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-scheduler/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-scheduler)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** execução local limitada e placement explicável de Core.

**Dependências internas:** `appcore-contracts`, `appcore-core`.

**API principal:** `Scheduler`, `SchedulerConfig`, `ScheduledTask`,
`TaskSchedule`, callback/context/result, retry policy, handle e snapshots;
requests/candidates/rejections/evaluations/decisions de recursos e
`PlacementEngine`.

Use para trabalho local declarado com limites, cancelamento e shutdown. Não é
workflow engine durável nem fila distribuída.

O shutdown fecha a admissão mantendo o lock do estado, e a aritmética de
deadlines é verificada. Tempos one-shot, interval ou retry não representáveis
retornam `InvalidSchedule` ou removem a task esgotada em vez de causar panic.

**Maturidade:** perfil local estável; scheduling é local ao processo.
