---
title: appcore-sync-sqlite
sidebar_position: 23
---

# appcore-sync-sqlite

:::warning Alpha publicada
Pós-1.0 **`0.1.0-alpha.2`** ·
[crates.io](https://crates.io/crates/appcore-sync-sqlite/0.1.0-alpha.2) ·
[docs.rs](https://docs.rs/crate/appcore-sync-sqlite/0.1.0-alpha.2) ·
[código-fonte público](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-sync-sqlite) ·
não selecionável pelo manifest V1 estável nem registrada pelo `appcore-bin`.
:::

**Responsabilidade:** persistência SQLite opcional e limitada para estado de
sync do Runtime. Ela implementa os contratos de replication log, outbox e
checkpoint e possui tombstones opacos, restore de snapshot portável, inspeção
de integridade e backup online. Não expõe SQL arbitrário nem schemas de
aplicação.

**Dependências AppCore diretas:** `appcore-sync`, `appcore-storage`.

A documentação do crate está disponível no
[guia](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/examples/intermediate.pt.md),
com variantes em inglês e francês ao lado.

O provider usa schema interno V2 transacional, WAL, `synchronous=FULL`, pool de conexões
limitado e limites de runtime do SQLite. Schemas desconhecidos, removidos ou
futuros falham com `NO MORE SUPPORTED PLEASE UPDATE`. Backup e restore publicam
somente arquivos novos verificados; restore nunca substitui database em uso.

O enqueue da outbox calcula o tamanho exato do JSON canônico e escreve
diretamente em um BLOB incremental do SQLite. Verificação de duplicatas, reads
de página e validação de integridade no startup também transmitem o conteúdo do
BLOB, evitando um `Vec<u8>` codificado adicional do tamanho do record ao lado
da mensagem owned.

As garantias declaradas são transactions, locking, snapshot, backup online e
operação multiprocesso em um filesystem local. Streaming, multi-host e shares
de rede não são garantidos.

:::warning Próxima atualização prerelease do schema
A branch de desenvolvimento avança o database interno para schema V2. Ela
adiciona contadores limitados de attempt e timestamps de readiness; a metadata
da página é selecionada antes de ler BLOBs, stats não contêm payload e receipts
parciais exatos são transacionais. Database conhecido em schema V1 migra
atomicamente. Schemas desconhecidos e futuros continuam na update wall;
rollback exige o backup verificado anterior à migração.

A criação do snapshot portável agora move os payloads do database para o
snapshot. O restore valida e insere por referências compartilhadas e rejeita
bytes de payload agregados acima do orçamento configurado antes de remover rows
existentes. Um workload de 32 MiB no Apple M1 reduziu o p50 de 466,80 para
396,00 ms e o RSS pico de 108,97 para 73,84 MiB ao eliminar duas réplicas
temporárias dos payloads.
:::

## Limites certificados

A certificação release com fonte limpa em `0f6f6d0` passou em macOS arm64 com
Rust 1.97.1. Em 2.048 appends duráveis de 1 KiB e 2.048 leituras pontuais, o p99
de append foi 1,086 ms a 3.729 operações/s e o p99 de leitura foi 0,583 ms a
6.578 operações/s. O backup online verificado de 3.182.592 bytes levou 73,870
ms; a verificação integral levou 15,675 ms. Os 14 testes de conformidade também
passaram em Linux arm64 e amd64; check cruzado e Clippy Windows GNU passaram.

O provider usa os contratos coordenados `appcore-sync` e `appcore-storage`
`2.0.0-alpha.1`. Aplicações estáveis `1.0.0` não o selecionam implicitamente;
a adoção é uma escolha explícita de prerelease.
