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

`appcore-bin export --out CAMINHO` dimensiona o pretty JSON de diagnóstico sob
um teto de 64 MiB antes de criar a saída. Depois, serializa com buffer fixo de
64 KiB e snapshot de auditoria imutável compartilhado, sem um `Vec` do resultado
completo nem clone profundo da lista. Falha de serialização ou escrita remove o
novo arquivo incompleto e um caminho existente nunca é sobrescrito.

Os diagnósticos expõem a pressão de `audit_memory` e `event_bus` com bytes
atuais, de pico e máximos, além de evictions e rejeições de itens grandes. Esses
contadores não contêm mensagens de auditoria nem payloads opacos de eventos.

Os dois binários processam entrada UTF-8 limitada por `appcore-args`. Ajuda,
validação e completion dinâmica para Bash, Zsh, Fish e PowerShell compartilham
uma especificação declarativa; a execução permanece neste crate.

O manifesto distribuído final alimenta um único catálogo de
`appcore-capabilities` durante o bootstrap. Facade direta, HTTP de aplicação e
peer RPC usam o mesmo owner para enforcement de declaração, mode,
idempotência, escrita operacional e liderança. Queries de status do Runtime
permanecem comportamento explícito do host.

Na linha de manutenção 1.0 atual, handlers da facade direta, HTTP de aplicação
e peer RPC executam sem manter o mutex compartilhado do host. Comandos
independentes avançam em paralelo; a reserva idempotente permanece serializada
por store. `shutdown()` fecha a admissão, drena comandos admitidos por no
máximo 30 segundos e só então conclui o lifecycle. Testes embutidos podem
escolher um limite menor com `shutdown_with_timeout`.
O registro de queries de aplicação é congelado após o bootstrap; queries
diretas, HTTP e peer RPC clonam o router imutável e executam sem o mutex do host.

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

A AC-023 mediu o consumer mínimo empacotado e manteve esse ownership combinado
de facade/composição para 1.x. Consulte a
[decisão de ownership da facade](/architecture/appcore-bin-facade).

## `1.0.2-rc`: geração HTTP supervisionada

O candidato `1.0.2-rc` compõe o listener HTTP por uma geração de
`ReloadableRuntimeHttpHost` registrada como o serviço gerenciado `http`
existente. O Supervisor global continua como único owner do lifecycle; não há
Supervisor aninhado nem worker de reload destacado. Rotas estáveis e o caminho
1.0 de `RuntimeHttpHost` continuam inalterados.

Essa integração estabelece prepare, troca atômica, drain limitado e rollback no
mesmo listener. Ela não observa manifests V1 nem liga outro endereço
silenciosamente. Veja [reload coordenado](/architecture/reload).

## Integração AI experimental disponível no código-fonte

O workspace de desenvolvimento atual possui a feature opt-in `ai-alpha`, que
**não faz parte do artifact `appcore-bin 1.0.0` publicado**. Ela anexa um
`appcore_ai::AiRuntime` já configurado por `AppCoreAiComponent` e
`ManifestApplicationHost::with_ai`. O Supervisor existente possui health
required/optional, cancelamento e shutdown limitado.

Essa bridge programática não altera manifests V1. Ela pertence à linha de
release beta independente [`appcore-ai 0.1.0-beta.3`](./appcore-ai); seleção
declarativa exige contrato versionado pós-1.0 e uma release AppCore publicável.

**Maturidade:** facade manifest-first estável; internals são detalhes.
