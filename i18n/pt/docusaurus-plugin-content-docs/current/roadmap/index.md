---
title: Roadmap futuro
description: Componentes AppCore planejados e em pesquisa que não fazem parte dos 22 crates estáveis.
sidebar_position: 1
slug: /roadmap/
---

# Roadmap futuro

:::caution Componentes futuros
Este roadmap é conceitual. Estes componentes **não são crates publicados**, não
alteram os 22 crates públicos estáveis e não devem ser usados como dependências
até mudarem de status por revisão normal de design, implementação e release.
:::

O AppCore mantém a documentação estável do Runtime separada do design futuro.
As entradas abaixo reservam nomes, fronteiras e intenção para que crates
planejados possam ser discutidos sem parecerem APIs disponíveis.

Promoção de status é manual. Um componente pode preservar seu slug ao passar de
Research para Planned, In Design, Alpha, Beta, RC ou Stable, mas nenhuma
promoção acontece automaticamente só porque um crate apareceu no repositório do
Runtime.

## In Design

| Componente | Status | Fronteira |
| --- | --- | --- |
| [appcore-ai](/crates/appcore-ai) | In Design | Fronteira adaptativa de runtime de IA para roteamento de modelos, inferência local ou remota, governo de recursos, proveniência, segurança e execução observável. |
| [appcore-ui](/crates/appcore-ui) | In Design | Fronteira de superfícies de UI para páginas HTML/TypeScript, views nativas Rust, lifecycle de janela, eventos, estado visual e futuro page builder. |

## Alta Prioridade

| Componente | Status | Fronteira |
| --- | --- | --- |
| `appcore-test` | Planned | Harness determinístico com `TestAppCore`, clock, storage, transport, peers, providers, AI, device/UI fake, fault injection e simulação de rede. |
| `appcore-jobs` | Planned | Lifecycle durável: Created, Queued, Running, Completed, Failed ou Retry. Scheduler decide quando e onde; jobs possuem persistência e lifecycle. |
| `appcore-search` | Planned | Fronteira local-first para full-text, metadata, filtros e ranking, com retrieval vector/hybrid possível depois sem prometer vector DB próprio. |
| `appcore-automation` | Planned | Workflow determinístico `Event -> Condition -> Action -> Command` com IA opcional e futura edição visual. |
| `appcore-plugin` | Planned | Extensibilidade para providers, backends de IA, componentes de UI, adapters de device e integrações, começando por composição Rust estática. |

## Expansão de Plataforma

| Componente | Status | Fronteira |
| --- | --- | --- |
| `appcore-media` | Planned | Áudio, vídeo, captura, playback, encode/decode e streaming para UI, IA e aplicações sem comprometer codecs. |
| `appcore-device` | Planned | Fronteira controlada por capabilities para USB, Bluetooth, serial, HID, sensores, câmera, microfone, displays e descoberta de GPU/NPU. |
| `appcore-agent` | Planned | Objetivo, planejamento, ferramentas, memória e ações sobre IA, sem misturar agent com inferência. |
| `appcore-data` | Planned | `Source -> Decode -> Validate -> Transform -> Batch/Stream -> Sink`; não é ORM nem dataframe por padrão. |
| `appcore-cache` | Planned | Cache pequeno e limitado com TTL, eviction e métricas; não compete com Redis. |
| `appcore-runtime-sdk` | Planned | Facade ergonômica como `app.ai()`, `app.ui()` e `app.storage()` sobre superfícies existentes, não uma segunda implementação. |

## Em Avaliação

| Componente | Status | Fronteira |
| --- | --- | --- |
| `appcore-events` | Research | Candidato a event bus apenas se análise provar que a responsabilidade de eventos está dispersa o bastante. |
| `appcore-config` | Research | Candidato para camadas defaults, file, env, CLI e deployment; `appcore-args` continua dono de CLI. |
| `appcore-secrets` | Research | Possível separação de security apenas se resolução, rotação, escopo e auditoria de secrets precisarem de dono próprio. |
| `appcore-sandbox` | Research | Candidato a fronteira de isolamento; nenhuma garantia de sandbox é afirmada antes de implementação e threat model. |

## Pesquisa Futura

| Componente | Status | Fronteira |
| --- | --- | --- |
| `appcore-browser` | Research | Pesquisa de browser e automação web controlada, sem compromisso de virar browser engine. |
| `appcore-spatial` | Research | Possível evolução de UI para scene, XR, AR ou VR. |
| `appcore-sim` | Research | Simulação determinística de clusters, devices, rede e pressão, diferente de `appcore-test`. |
| `appcore-cloud` | Research | Pesquisa de abstração de deployment/orquestração, não um cloud provider. |

## Regras de Promoção

- Componentes futuros não entram no grafo estável de crates.
- Planned mais crate ausente é válido.
- Planned mais crate presente exige revisão e não promove automaticamente.
- Stable mais crate ausente é erro.
- Slugs devem ser preservados quando um componente amadurece.
- Página futura não deve incluir comandos de instalação, versões inventadas nem datas de release.
