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

Callbacks usam um pool fixo limitado por `max_concurrent_tasks` e uma fila
interna limitada. Trabalho devido excedente permanece agendado sem consumir
retry; `worker_thread_count`, `queued_task_count` e `queue_saturation_count`
expõem o limite e a pressão. O shutdown drena callbacks aceitos com cancelamento
cooperativo; callbacks devem consultar `TaskContext::is_cancelled()` porque
threads Rust não recebem timeout forçado.

## `1.0.2-rc`: recovery opt-in

O candidato `1.0.2-rc` implementa a fronteira
`SchedulerStateProvider` V1. `Scheduler::with_state_provider` seleciona owner,
TTL do claim, tolerância de clock skew e provider com limites;
`schedule_durable` inclui tasks individuais no estado persistido de next run,
attempt, misfire, fencing e receipt. `Scheduler::new` e `schedule` continuam
efêmeros e offline.

O provider em arquivo combina locking no processo e entre processos com
snapshot V1 limitado e checksummed e troca atômica. Claims são adquiridos antes
do dispatch e renovados durante a execução. Callbacks recebem
`TaskContext::fencing_epoch()` e devem aplicá-lo na fronteira do efeito
protegido quando houver owners concorrentes. O recovery continua at-least-once
até o commit do receipt; callbacks e dados de workflow da aplicação nunca são
serializados.

Esta API descreve apenas o status do source. Não presuma que ela esteja
disponível no pacote estável `1.0.0` indicado acima.

:::warning Atualização recomendada
Instale a versão do scheduler que contém AC-018 quando ela estiver disponível.
Versões anteriores criam uma nova thread do sistema operacional por execução;
esse caminho legacy não é mantido ao lado da correção limitada.
:::

**Maturidade:** perfil local estável; scheduling é local ao processo.
