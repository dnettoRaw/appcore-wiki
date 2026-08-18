---
title: appcore-core
sidebar_position: 7
---

# appcore-core

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-core/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-core/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-core)
:::


**Responsabilidade:** lifecycle, registro, dispatch, state, audit e idempotência
genéricos dentro do processo.

**Dependências AppCore diretas:** `appcore-contracts`, `appcore-types`.

**API principal:** `RuntimeBuilder`, `RuntimeController`, `RuntimeInstance`,
`RuntimeLifecycle`, registries e buses de command/event, envelopes,
`CommandHandler`, `CommandResult`, `RuntimeContext`, audit log/journal,
idempotência em memória/arquivo, state e decision engines, clock, redaction e
`AppPlugin` de compatibilidade.

Aplicações novas usam re-exports de `appcore_bin::application`; não montam o
core manualmente. Mantenha I/O adapters e comportamento de domínio fora.

**Maturidade:** superfície low-level RC estável; builder/plugin são de
compatibilidade e manifest-first é o caminho preferido.
