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

Aplicações novas usam re-exports de `appcore_bin::application`; não montam o
core manualmente. Mantenha I/O adapters e comportamento de domínio fora.

**Maturidade:** superfície low-level estável; builder/plugin são de
compatibilidade e manifest-first é o caminho preferido.
