---
title: Mapa de crates
sidebar_position: 12
---

# Mapa de crates

Quando um runtime cresce, os limites entre crates precisam explicar a arquitetura. No AppCore eles seguem ownership, não conveniência.

A release estável `1.0.0` contém 22 crates públicos, todos publicados no
crates.io. Cada crate público possui SemVer independente, mesmo quando vários
números de versão coincidem. A referência individual está no
[catálogo de crates](/crates/).

| Camada | Crates | Por que existe |
| --- | --- | --- |
| Fundações standalone | `appcore-args`, `appcore-supervisor`, `appcore-transport` | componentes reutilizáveis e versionados independentemente, sem dependências AppCore |
| Contratos | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` | manifests, identidades validadas, contratos wire e composição de providers |
| Runtime | `appcore-core`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-api`, `appcore-update` | comportamento e infraestrutura do Runtime com fronteiras explícitas |
| Integrações | `appcore-gateway`, `appcore-provider-vercel-neon` | integrações de transport e provider operadas externamente |
| Composição | `appcore-bin` | único crate autorizado a compor infraestrutura concreta para aplicações |
| Ferramentas | `appcore-dev`, `runtime-console`, ferramentas de certificação | desenvolvimento, operação e evidência de release; não são crates públicos |

Todos os pacotes públicos são versionados separadamente. As fundações
standalone também continuam reutilizáveis sem dependências AppCore.
`appcore-supervisor` gerencia serviços em processo sem depender do dispatch de
commands; `appcore-args` faz parsing de CLI sem executar comandos do Runtime.

`appcore-bin` é o único composition root concreto para aplicações. Contratos não dependem de implementações, e código de negócio não deve importar módulos privados do host.

## Testes de fuzz

O repositório-fonte possui um workspace privado central com 12 alvos limitados
para fronteiras que recebem texto ou bytes não confiáveis. Ele cobre parsing de
CLI, manifests e identificadores, framing HTTP, mensagens distribuídas,
containers DNT, requests da API, tokens de segurança, paths de storage,
envelopes de sync, Peer RPC, DTOs do gateway e descritores de update.
`appcore-ai` e `appcore-filemaker` mantêm workspaces especializados junto das
suas implementações.

Execute `appcore-dev test fuzz` para compilar todos os workspaces de fuzz com
dependências travadas. O mesmo gate usa os lockfiles commitados dos consumers
externos SDK e three-artifact e falha em vez de atualizar silenciosamente uma
fixture. Cada alvo rejeita entradas maiores que 256 KiB antes de chamar a
fronteira. Código de ciclo de vida com estado continua coberto por testes
determinísticos, de propriedades, concorrência e integração, pois bytes
aleatórios não representam bem essas invariantes.

## Limitations

- Este mapa explica ownership; use o [catálogo de crates](/crates/) para
  APIs, limites, maturidade e links do registry.
- Crates de tooling/certificação podem não ser superfície estável de aplicação.
- Módulos internos podem mudar mesmo quando manifests e facade pública continuam compatíveis.
