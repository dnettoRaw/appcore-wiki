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
baseados em DNT sem expor plaintext ao código de roteamento. Seu teto público
de retenção `MAX_OPAQUE_MESSAGE_ID_BYTES` é de 1.024 bytes UTF-8.

`HttpSyncTransport` possui um cliente HTTP reutilizável e limitado. Use
`with_timeout_ms` para o deadline V1 uniforme ou `with_timeouts` para deadlines
independentes de conexão/admissão, leitura e escrita.

O encode wire V1 empresta identidade de origem, mensagem e eventos enquanto
grava a `String` de saída exigida. Ele não retém um batch clonado ao lado dessa
saída e preserva o JSON V1 owned exato e a validação do node de origem.

A API de snapshot do `1.0.2-rc` consome pares sequence/payload owned com
`ReplicationSnapshot::try_from_records` e move cada payload para o valor V1
portável. `ReplicationSnapshot::validate` verifica o contrato completo por uma
referência compartilhada, portanto providers persistentes não precisam clonar
a coleção de payloads antes do restore.

Use para replicação compatível, ordenada e hash-chained. Não ignore identidade
ou protocolo nem trate como RAFT, multi-master ou resolvedor de conflito de
negócio.

O log file é limitado a 256 MiB e a outbox a 64 MiB. IDs de peer e hashes de
checkpoint são validados na escrita e na leitura. O receiver valida o batch
completo, a aritmética de sequence e cada limite de record antes de alterar log
ou checkpoint; um evento inválido no fim não deixa append parcial.

:::warning Atualização da outbox no `1.0.2-rc`
No `1.0.2-rc`, `FileSyncOutbox` aceita apenas o journal binário explícito
`appcore-sync-outbox-v2`. Arquivos V1, sem versão ou futuros falham com
`NO MORE SUPPORTED PLEASE UPDATE`; não existe conversão automática. Drene V1
antes do upgrade e V2 antes do rollback. Enqueue e ACK passam a acrescentar e
sincronizar um frame encadeado por integridade, sem reescrever o arquivo todo.
A extensão aditiva de paginação oferece `peek`, `stats` sem payload,
`mark_attempt` persistido, `next_ready` e receipts parciais de prefixo exato.
Consumidores novos usam `pending_page`, `outbox_stats` e
`flush_pending_with_progress`; o wire peer V1 permanece inalterado.
:::

`InMemorySyncOutbox` mede os bytes JSON exatos com um writer contador protegido
contra overflow, sem alocar uma segunda mensagem codificada. Para um batch
válido de 4 MiB no Apple M1, o p50 caiu de 23,55 ms para 10,92 ms e o RSS pico
de 45,73 MiB para 17,52 MiB; limites de página e `pending_bytes` permanecem
exatos.

`FileSyncOutbox` agora mede o JSON do receipt e o serializa diretamente por um
writer fixo de 64 KiB. O fixture máximo de 1.024 IDs escapados tem 2.086.913
bytes e não fica mais retido como `Vec` adicional em produção; o scan empresta
IDs que não exigem desfazer escapes JSON. IDs indexados também são compartilhados
com o estado transacional do scan de tail; refresh clona handles em vez de cada
identificador pendente.

A janela fixa de 10.000 IDs processados do receiver também compartilha cada
`batch_id` entre lookup de duplicata e eviction do mais antigo. Aplicar 10.000
batches com IDs de 128 bytes no Apple M1 mediu 58,27 ms p50 e reduziu RSS pico
de 17,45 MiB para 15,27 MiB sem mudar os resultados. As fronteiras do receiver
e da outbox rejeitam IDs vazios, caracteres de controle e IDs acima de 1.024
bytes UTF-8 antes da retenção; a janela fica limitada por bytes e por quantidade.

**Maturidade:** perfil conservador estável com decode V1 estrito.
