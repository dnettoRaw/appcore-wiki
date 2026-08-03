---
title: Sync, logs, checkpoints e replay
sidebar_position: 5
---

# Sync, logs, checkpoints e replay

Imagine uma loja sem internet por oito horas. O operador continua emitindo orçamentos. Quando a rede volta, o runtime precisa saber o que já foi enviado, o que é novo, o que é retry e o que é conflito.

Sync no AppCore é replicação conservadora leader-to-follower. Não é RAFT, multi-master nem resolvedor de conflitos de domínio.

## O que acontece quando a loja reconecta?

Commands locais podem continuar conforme a política de storage e command. Quando a rede volta, o receiver não confia no batch: valida identidade, protocolo, sequência, count, tamanho, hash, previous hash e checkpoint.

Se a mesma sequência reaparece com o mesmo payload, é retry. Se a mesma sequência reaparece com bytes diferentes, não é retry: é conflito.

## O que um SyncMessage prova?

Um batch carrega `batch_id`, source node, `sequence_start`, `sequence_end`, event count, hash dos eventos, timestamp, previous batch hash e payloads opacos.

```mermaid
flowchart LR
    LeaderLog[Log do líder] --> Batch[SyncMessage]
    Batch --> Hash[Hash metadata + payload]
    Hash --> Receiver[Validação]
    Receiver --> FollowerLog[Log do follower]
    FollowerLog --> Checkpoint[Checkpoint por peer]
```

O hash cobre metadata e tamanho dos payloads, não apenas os bytes soltos. Isso impede aceitar o mesmo payload com metadata de sequência diferente.

## Por que manter replication log?

O log file-backed usa marcador `# appcore-replication-log-v1`, limite total, limite por record, sequence map, hash chain, lock e atomic write. Append por sequência é idempotente: mesma sequência e mesmo payload retorna o índice original; mesma sequência e payload diferente é conflito.

O log é evidência de replay. Sem log, recovery teria que confiar em projections de aplicação, que podem ter sido compactadas, migradas ou parcialmente reconstruídas.

## Por que checkpoint existe se já existe replay?

Checkpoint guarda última sequência aceita e batch hash por peer em formato `# appcore-sync-checkpoint-v1`. Peer IDs e hashes são validados e o arquivo é substituído atomicamente.

Sem checkpoint, recovery teria que replayar tudo ou inferir progresso pela projection. AppCore não faz essa inferência.

## Onde entra idempotency?

Idempotency de command e idempotency de batch resolvem problemas diferentes. A key de command evita duplicar retry de cliente. A sequência/checkpoint evita duplicar replicação entre peers. Os dois limites precisam existir porque os retries acontecem em fronteiras diferentes.

## Limitations

- Sync é leader-to-follower, não RAFT nem multi-master.
- AppCore detecta conflito de sequência/hash, mas não mescla alterações de negócio.
- Checkpoint prova progresso aceito pelo runtime, não correção de projection.
- Replay depende de handlers respeitarem idempotency.
- Partições de rede são tratadas de forma conservadora; writes que exigem liderança não prometem disponibilidade global contínua.

Próximo: [operação distribuída](/pt/architecture/distributed).
