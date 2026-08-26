---
title: appcore-sync-sqlite
sidebar_position: 23
---

# appcore-sync-sqlite

:::warning Prévia de desenvolvimento
Pós-1.0 **`0.1.0-alpha.1`** · não publicada · não selecionável pelo manifest V1
congelado nem registrada pelo `appcore-bin`.
:::

**Responsabilidade:** persistência SQLite opcional e limitada para estado de
sync do Runtime. Ela implementa os contratos de replication log, outbox e
checkpoint e possui tombstones opacos, restore de snapshot portável, inspeção
de integridade e backup online. Não expõe SQL arbitrário nem schemas de
aplicação.

**Dependências AppCore diretas:** `appcore-sync`, `appcore-storage`.

A documentação do crate é mantida como `guide.pt.md`, `basic.pt.md` e
`intermediate.pt.md`. Links públicos substituirão esses identificadores após a
publicação da prerelease.

O provider usa schema interno V1 fixo, WAL, `synchronous=FULL`, pool de conexões
limitado e limites de runtime do SQLite. Schemas desconhecidos, removidos ou
futuros falham com `NO MORE SUPPORTED PLEASE UPDATE`. Backup e restore publicam
somente arquivos novos verificados; restore nunca substitui database em uso.

As garantias declaradas são transactions, locking, snapshot, backup online e
operação multiprocesso em um filesystem local. Streaming, multi-host e shares
de rede não são garantidos.

## Limites certificados

A certificação release com fonte limpa em `0f6f6d0` passou em macOS arm64 com
Rust 1.97.1. Em 2.048 appends duráveis de 1 KiB e 2.048 leituras pontuais, o p99
de append foi 1,086 ms a 3.729 operações/s e o p99 de leitura foi 0,583 ms a
6.578 operações/s. O backup online verificado de 3.182.592 bytes levou 73,870
ms; a verificação integral levou 15,675 ms. Os 14 testes de conformidade também
passaram em Linux arm64 e amd64; check cruzado e Clippy Windows GNU passaram.

A publicação exige versões prerelease coordenadas dos contratos pós-1.0 ainda
não publicados de `appcore-sync` e `appcore-storage`. Links do registry e do
source mirror serão adicionados somente quando essa release existir.
