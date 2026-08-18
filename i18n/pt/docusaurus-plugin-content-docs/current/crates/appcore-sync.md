---
title: appcore-sync
sidebar_position: 11
---

# appcore-sync

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-sync/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-sync/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-sync)
:::


**Responsabilidade:** replicação conservadora leader-to-follower e helpers de
durabilidade local.

**Dependências AppCore diretas:** `appcore-core`, `appcore-distributed-contracts`, `appcore-ops`, `appcore-transport`.

**API principal:** node role/status/peer/heartbeat e `SyncMessage`; codec wire
V1; replication logs/snapshots; checkpoints e outbox memória/arquivo; receiver
state/ack; follower client; HTTP transport; peer discovery; retry, métricas e
`SyncError`.
Contratos de content-envelope opaco são reexportados para pacotes sync
baseados em DNT sem expor plaintext ao código de roteamento.

Use para replicação compatível, ordenada e hash-chained. Não ignore identidade
ou protocolo nem trate como RAFT, multi-master ou resolvedor de conflito de
negócio.

O log file é limitado a 256 MiB e a outbox a 64 MiB. IDs de peer e hashes de
checkpoint são validados na escrita e na leitura. O receiver valida o batch
completo, a aritmética de sequence e cada limite de record antes de alterar log
ou checkpoint; um evento inválido no fim não deixa append parcial.

**Maturidade:** perfil RC conservador estável com decode V1 estrito.
