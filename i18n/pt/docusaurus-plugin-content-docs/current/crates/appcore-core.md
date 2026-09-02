---
title: appcore-core
sidebar_position: 8
---

# appcore-core

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-core/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-core/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-core)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** lifecycle, registro, dispatch, state, audit e idempotência
genéricos dentro do processo.

**Dependências internas:** `appcore-contracts`, `appcore-types`.

**API principal:** `RuntimeBuilder`, `RuntimeController`, `RuntimeInstance`,
`RuntimeLifecycle`, registries e buses de command/event, envelopes,
`CommandHandler`, `CommandResult`, `RuntimeContext`, audit log/journal,
idempotência em memória/arquivo, state e decision engines, clock, redaction e
`AppPlugin` de compatibilidade.

Na linha de manutenção 1.0 atual, clones de `RuntimeController` compartilham
lifecycle, idempotência e estado inflight, enquanto o command bus imutável
possui handlers por `Arc`. Handlers independentes executam em paralelo; uma
chave idempotente ainda admite no máximo uma execução. O shutdown fecha a
admissão atomicamente antes da drenagem limitada dos comandos admitidos.

`RuntimeLifecycle` guarda um único enum de estado `Copy` no mutex e aplica as
12 transições estáveis exatas por uma função total. Nenhum nome validado ou
tabela de transições é alocado por instância. A `StateMachine` pública genérica
continua disponível e inalterada para estados pertencentes à aplicação.

O `AuditLog` local ao processo limita os snapshots de commands e entradas
genéricas a 10.000 itens e um orçamento padrão compartilhado de 16 MiB.
`with_max_bytes` pode apertar o orçamento; `stats` expõe bytes atuais/de pico,
evictions e rejections; `write_jsonl` transmite um snapshot copy-on-write
compartilhado depois de liberar o lock de estado. O adaptador compatível
`export_jsonl` retorna intencionalmente uma String owned.

Use `entries_snapshot` para obter um array JSON estruturado. A visão imutável
implementa `Serialize`, compartilha o armazenamento retido em vez de cloná-lo
profundamente e permanece estável após mutações posteriores. A fixture
pretty-JSON medida tinha 10.000 entradas e 2.996.676 bytes, com 1,12 ms p50 e
6,42 MiB de RSS pico no Apple M1.

`records_snapshot` fornece a visão correspondente dos registros de command. Os
dois tipos de snapshot expõem `recent(limit)` para o caller emprestar somente a
página mais nova após liberar o lock. Uma seleção de 1.000 em 10.000 mediu
2,06 us p50 e 11,88 MiB de RSS pico, contra 4,16 ms e 20,33 MiB para cópias
owned integrais.

O `EventBus` local ao processo retém separadamente no máximo 10.000 eventos e
16 MiB por padrão. `stats` expõe bytes atuais/de pico, evictions e rejeições de
eventos grandes; `snapshot().recent(limit)` empresta uma página estável.
Selecionar 1.000 de 10.000 eventos mediu 2,39 us p50 e 8,48 MiB de RSS pico,
contra 2,09 ms e 14,59 MiB do método compatível de cópia integral.

Aplicações novas usam re-exports de `appcore_bin::application`; não montam o
core manualmente. Mantenha I/O adapters e comportamento de domínio fora.

**Maturidade:** superfície low-level estável; builder/plugin são de
compatibilidade e manifest-first é o caminho preferido.
