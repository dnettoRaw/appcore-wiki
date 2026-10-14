---
title: Roadmap futuro
description: Prereleases publicadas, componentes planejados e pesquisa AppCore.
sidebar_position: 1
slug: /roadmap/
---

# Roadmap futuro

:::caution Componentes futuros
Este roadmap separa prereleases e componentes conceituais do catálogo atual de
crates públicos. Entradas Alpha, Beta ou RC continuam opt-in, e cada página diz
se houve publicação; entradas planejadas e de pesquisa não devem ser usadas
como dependências.
:::

O AppCore mantém a documentação estável do Runtime separada do design futuro.
As entradas abaixo reservam nomes, fronteiras e intenção para que crates
planejados possam ser discutidos sem parecerem APIs disponíveis.

Promoção de status é manual. Um componente pode preservar seu slug ao passar de
Research para Planned, In Design, Alpha, Beta, RC ou Stable, mas nenhuma
promoção acontece automaticamente só porque um crate apareceu no repositório do
Runtime.

## Beta

| Componente | Status | Fronteira |
| --- | --- | --- |
| [appcore-ai](/pt/crates/appcore-ai) | Beta | `0.1.0-beta.5` publicada para routing limitado, inferência local/remota, recursos, provenance, segurança e execução observável. |
| [appcore-filemaker](/pt/crates/appcore-filemaker) | Beta | `0.1.0-beta.6` publicada para compilação determinística de documentos, canvases vetoriais e datasets limitados. |
| [appcore-ui](/pt/crates/appcore-ui) | Beta | `0.1.0-beta.1` (crates.io). Fronteira de superfícies de UI para páginas HTML/TypeScript, views nativas Rust, lifecycle de janela, eventos, estado visual e futuro page builder. |
| [appcore-filemaker-ai](/pt/crates/appcore-filemaker-ai) | Beta | Bridge opcional e limitado `0.1.0-beta.5` publicado; IA permanece fora do compiler determinístico. |
| [appcore-filemaker-cli](/pt/crates/appcore-filemaker-cli) | Beta | Adapter de processo limitado `0.1.0-beta.5` publicado para compilação, diagnóstico e export explícito. |

| [appcore-transfer](/pt/crates/appcore-transfer) | Beta | `0.1.0-beta.1` — crates.io. Transferência retomável de objetos opacos imutáveis entre múltiplos peers autorizados, com blocos verificados, quotas e concorrência limitada; separada do roteamento mesh. |

## RC

| Componente | Status | Fronteira |
| --- | --- | --- |
| [appcore-log](/pt/crates/appcore-log) | RC | Pipeline de logging estruturado e limitado `1.0.0-rc.3` publicado para componentes do Runtime e aplicações SDK. |
| [appcore-sdk](/pt/crates/appcore-sdk) | RC | Facade de aplicação manifest-first `1.0.2-rc` publicada, substituindo o `appcore-bin` aposentado. |

## Alpha

| Componente | Status | Fronteira |
| --- | --- | --- |
| [appcore-sync-sqlite](/pt/crates/appcore-sync-sqlite) | Alpha | `0.1.0-alpha.7` publicada para persistência opcional do estado de sync do Runtime. |

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
| `appcore-mcu` | Planned | Integração leve e autenticada de microcontroladores, com mensagens e capabilities limitadas; perfil de firmware `no_std` opcional e drivers da aplicação. |
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

## MCU e Transferência Mesh

MCU continua planejado; nome, API, placa suportada e data de release são provisórios. `appcore-transfer` já está publicado como `0.1.0-beta.1`. A qualificação restante em hardware e mesh não transforma o crate em componente futuro.

### Integração de Microcontroladores

`appcore-mcu` permitiria a participação de dispositivos restritos por identidade,
autenticação, capabilities declaradas, comandos/eventos limitados e estado de
disponibilidade explícito. Avaliar biblioteca leve de firmware `no_std`
separadamente do adaptador de host. Drivers, HAL, sensores, atuadores e
comportamento pertencem ao firmware da aplicação ou aos adaptadores de hardware.
Um MCU não é automaticamente um Core completo do Runtime. Coordenar com
`appcore-device` para evitar sobreposição no acesso a dispositivos pelo host.

Etapas de implementação:

1. Escolher placa piloto, definir budgets de RAM/flash/conectividade e revisar
   contrato versionado, provisionamento, autorização e semântica de replay.
2. Implementar codec limitado e adaptador de host; testar frames inválidos,
   saturação, reconexão, cancelamento e shutdown do host.
3. Validar boot, perda de energia e recuperação em hardware real; documentar
   limites medidos e exemplos básicos/intermediários em inglês, português e
   francês antes de ampliar os alvos.

### Transferência entre Múltiplos Peers

[appcore-transfer](/pt/crates/appcore-transfer) já fornece blocos imutáveis verificados, retomada durável, agendamento limitado entre fontes e integração opcional Peer RPC V2 assinada existente. Descoberta, roteamento mesh e relays permanecem com seus donos; compatibilidade BitTorrent, DHT pública e descoberta anônima estão fora do contrato.

Qualificação e integração com consumidores ainda pendentes:

1. Medir throughput, RAM e tráfego em redes reais compartilhadas contra fonte única; qualificar mesh física e relays.
2. Exercitar partições reais, perda de energia e cargas prolongadas no hardware de deployment, preservando evidência de recuperação.
3. Validar consumidores opcionais de update/snapshots preservando autenticidade, compatibilidade, health gates e rollback.
4. Adicionar entrega a MCU só após contrato limitado de host/device e evidência em hardware real. Hash válido do objeto não autoriza instalar firmware.

### Validação Conjunta

Após adaptador de host e transferência entre fontes funcionarem separadamente,
validar host/gateway recebendo blocos de peers e entregando partes limitadas ao
MCU. Servir blocos diretamente pelo MCU exige evidência própria de memória,
storage, energia e conectividade. Instalação de firmware exige também contrato
revisado de bootloader, autenticidade, compatibilidade, health e rollback.

As trilhas preservam os três artefatos, composição explícita de deployment, providers opcionais e contratos versionados. MCU precisa de implementação e evidência de release antes de entrar no catálogo ativo. Transfer já é beta ativo; promoção a estável exige qualificação própria revisada.

## Regras de Promoção

- Componentes futuros não entram no grafo estável de crates.
- Planned mais crate ausente é válido.
- Planned mais crate presente exige revisão e não promove automaticamente.
- Stable mais crate ausente é erro.
- Slugs devem ser preservados quando um componente amadurece.
- Página futura não deve incluir comandos de instalação, versões inventadas nem datas de release.
