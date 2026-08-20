---
title: appcore-supervisor
sidebar_position: 5
---

# appcore-supervisor

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-supervisor/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-supervisor/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-supervisor)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-supervisor/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-supervisor/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-supervisor/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** lifecycle com dependências, health, orçamento de restart
e shutdown dos managed services pertencentes ao Runtime.

**Dependências internas:** nenhuma.

**Versionamento:** SemVer independente. O crate pode ser consumido sem qualquer
outro pacote AppCore.

**API principal:** `ManagedService`, `ServiceDescriptor`, `ServiceDependency`,
`DependencyRequirement`, `Supervisor`, `SupervisorWatchdog`, `RestartPolicy`,
`RestartState`, `ServiceHealth`, `ServiceActivationState`,
`ServiceRuntimeState`, snapshots/eventos tipados e adapters.

Use na composition root para Scheduler, Peer RPC, Control Plane, Jobs, Update,
Auth Server, Metrics, Observation, Sync, workers e queues. Nao use para
reiniciar o processo host. Reconcile apenas agenda restart; um executor
limitado executa o lifecycle e o watchdog independente verifica progresso.

Não existe um segundo módulo Supervisor nem aliases em `appcore-ops`.

Panics de callback, factory e health probe tornam-se estados de falha
controlados; um panic em um restart não encerra o worker limitado. Aritmética
de timeout e contadores pending são verificados. O shutdown é cooperativo, logo
um callback arbitrário que ignore cancelamento não pode ser interrompido à
força com segurança dentro do processo.

**Maturidade:** contrato estavel em evolucao com eventos, fila, workers,
budgets e diagnostico limitados; a supervisao do processo permanece externa.
