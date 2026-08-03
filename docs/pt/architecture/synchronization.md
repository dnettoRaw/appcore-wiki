---
title: Sync, logs, checkpoints e replay
sidebar_position: 5
---

# Sync, logs, checkpoints e replay

Sync no AppCore é replicação conservadora leader-to-follower. Não é RAFT, multi-master nem resolvedor de conflitos de domínio.

## Quando a loja fica offline

Commands locais podem continuar conforme a política de storage e command. Quando a rede volta, o receiver não confia no batch: valida identidade, protocolo, sequência, count, tamanho, hash, previous hash e checkpoint.

## SyncMessage

Um batch carrega `batch_id`, source node, `sequence_start`, `sequence_end`, event count, hash dos eventos, timestamp, previous batch hash e payloads opacos.

```mermaid
flowchart LR
    LeaderLog[Log do líder] --> Batch[SyncMessage]
    Batch --> Hash[Hash metadata + payload]
    Hash --> Receiver[Validação]
    Receiver --> FollowerLog[Log do follower]
    FollowerLog --> Checkpoint[Checkpoint por peer]
```

## Replication log

O log file-backed usa marcador `# appcore-replication-log-v1`, limite total, limite por record, sequence map, hash chain, lock e atomic write. Append por sequência é idempotente: mesma sequência e mesmo payload retorna o índice original; mesma sequência e payload diferente é conflito.

## Checkpoints

Checkpoint guarda última sequência aceita e batch hash por peer em formato `# appcore-sync-checkpoint-v1`. Peer IDs e hashes são validados e o arquivo é substituído atomicamente.

Sem checkpoint, recovery teria que replayar tudo ou inferir progresso pela projection. AppCore não faz essa inferência.

Próximo: [operação distribuída](/pt/architecture/distributed).

