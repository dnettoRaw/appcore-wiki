---
title: appcore-bin
sidebar_position: 22
---

# appcore-bin

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-bin)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

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

Selecionar `[adapters.gateway]` com provider `appcore-gateway` e a fronteira
declarativa de ativacao do Gateway. O bootstrap faz parse pela crate owner,
inclui e autoriza `runtime.gateway` no catalogo compartilhado, reutiliza a
seguranca do Runtime e registra o servico no Supervisor. Falha de configuracao
ou bind aborta o startup; a ausencia nao cria listener nem task de Gateway.
`ApplicationServiceReport` expoe started, state e bind seguros, e o shutdown
do host faz join de todo o trabalho possuido pelo Gateway. O replay store e
seguro entre processos; cluster exige `paths.gateway_replay` absoluto em volume
compartilhado e gravavel. O shutdown fecha conexoes incompletas antes do prazo.

É a dependência recomendada para aplicações. Possui carregamento de manifests,
providers, lifecycle, HTTP, sync, peer RPC, control plane, Gateway, scheduling,
supervision, updates e shutdown.

Aplicações usam o módulo público `application` e evitam internals.

**Maturidade:** facade manifest-first estável; internals são detalhes.
