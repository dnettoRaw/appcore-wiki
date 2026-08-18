---
title: appcore-scheduler
sidebar_position: 13
---

# appcore-scheduler

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-scheduler/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-scheduler/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-scheduler)
:::


**Responsabilidade:** execução local limitada e placement explicável de Core.

**Dependências AppCore diretas:** `appcore-contracts`, `appcore-core`.

**API principal:** `Scheduler`, `SchedulerConfig`, `ScheduledTask`,
`TaskSchedule`, callback/context/result, retry policy, handle e snapshots;
requests/candidates/rejections/evaluations/decisions de recursos e
`PlacementEngine`.

Use para trabalho local declarado com limites, cancelamento e shutdown. Não é
workflow engine durável nem fila distribuída.

O shutdown fecha a admissão mantendo o lock do estado, e a aritmética de
deadlines é verificada. Tempos one-shot, interval ou retry não representáveis
retornam `InvalidSchedule` ou removem a task esgotada em vez de causar panic.

**Maturidade:** perfil local RC estável; scheduling é local ao processo.
