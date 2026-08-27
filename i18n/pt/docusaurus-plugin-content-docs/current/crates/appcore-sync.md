---
title: appcore-sync
sidebar_position: 12
---

# appcore-sync

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-sync/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-sync/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-sync)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** replicação conservadora leader-to-follower e helpers de
durabilidade local.

**Dependências internas:** `appcore-core`, `appcore-distributed-contracts`,
`appcore-ops`, `appcore-transport`.

**API principal:** node role/status/peer/heartbeat e `SyncMessage`; codec wire
V1; replication logs/snapshots; checkpoints e outbox memória/arquivo; receiver
state/ack; follower client; HTTP transport; peer discovery; retry, métricas e
`SyncError`.
Contratos de content-envelope opaco são reexportados para pacotes sync
baseados em DNT sem expor plaintext ao código de roteamento.

`HttpSyncTransport` possui um cliente HTTP reutilizável e limitado. Use
`with_timeout_ms` para o deadline V1 uniforme ou `with_timeouts` para deadlines
independentes de conexão/admissão, leitura e escrita.

Use para replicação compatível, ordenada e hash-chained. Não ignore identidade
ou protocolo nem trate como RAFT, multi-master ou resolvedor de conflito de
negócio.

O log file é limitado a 256 MiB e a outbox a 64 MiB. IDs de peer e hashes de
checkpoint são validados na escrita e na leitura. O receiver valida o batch
completo, a aritmética de sequence e cada limite de record antes de alterar log
ou checkpoint; um evento inválido no fim não deixa append parcial.

:::warning Atualização da outbox no candidato 1.5
No candidato 1.5, `FileSyncOutbox` aceita apenas o journal binário explícito
`appcore-sync-outbox-v2`. Arquivos V1, sem versão ou futuros falham com
`NO MORE SUPPORTED PLEASE UPDATE`; não existe conversão automática. Drene V1
antes do upgrade e V2 antes do rollback. Enqueue e ACK passam a acrescentar e
sincronizar um frame encadeado por integridade, sem reescrever o arquivo todo.
A extensão aditiva de paginação oferece `peek`, `stats` sem payload,
`mark_attempt` persistido, `next_ready` e receipts parciais de prefixo exato.
Consumidores novos usam `pending_page`, `outbox_stats` e
`flush_pending_with_progress`; o wire peer V1 permanece inalterado.
:::

**Maturidade:** perfil conservador estável com decode V1 estrito.
