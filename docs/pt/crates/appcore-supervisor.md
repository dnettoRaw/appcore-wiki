---
title: appcore-supervisor
sidebar_position: 4
---

# appcore-supervisor

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-supervisor/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-supervisor/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-supervisor)
:::


**Responsabilidade:** lifecycle com dependências, health, orçamento de restart
e shutdown dos managed services pertencentes ao Runtime.

**Dependências AppCore diretas:** Nenhuma.

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
