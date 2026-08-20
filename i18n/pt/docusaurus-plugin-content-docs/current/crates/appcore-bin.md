---
title: appcore-bin
sidebar_position: 22
---

# appcore-bin

:::info Pacote publicado
Publicado **`1.0.1-rc.8`** · workspace atual do Runtime **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-bin)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** facade manifest-first, CLI e composition root.

**Dependências internas:** todos os crates de serviço/composição.

**API de aplicação:** `Application`, `run_application`,
`ManifestApplicationHost`, `ApplicationServiceReport`, `DeploymentContext`,
volumes/environment resolvidos e `ApplicationTaskRegistry`.

**API de host:** bootstrap/config errors/results, CLI, paths/lifecycle local,
server entry points, build info e ferramentas opcionais de auth-server.

Os dois binários processam entrada UTF-8 limitada por `appcore-args`. Ajuda,
validação e completion dinâmica para Bash, Zsh, Fish e PowerShell compartilham
uma especificação declarativa; a execução permanece neste crate.

O manifesto distribuído final alimenta um único catálogo de
`appcore-capabilities` durante o bootstrap. Facade direta, HTTP de aplicação e
peer RPC usam o mesmo owner para enforcement de declaração, mode,
idempotência, escrita operacional e liderança. Queries de status do Runtime
permanecem comportamento explícito do host.

É a dependência recomendada para aplicações. Possui carregamento de manifests,
providers, lifecycle, HTTP, sync, peer RPC, control plane, scheduling,
supervision, updates e shutdown.

Aplicações usam o módulo público `application` e evitam internals.

**Maturidade:** facade manifest-first RC estável; internals são detalhes.
