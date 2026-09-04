---
title: Mapa de crates
sidebar_position: 12
---

# Mapa de crates

Quando um runtime cresce, os limites entre crates precisam explicar a arquitetura. No AppCore eles seguem ownership, não conveniência.

O catálogo atual do código-fonte contém 28 crates públicos ativos. Cada crate
possui SemVer independente, mesmo quando vários números coincidem; existir no
código-fonte não afirma, por si só, publicação no registry. A referência e os
IDs permanentes estão no [catálogo de crates](/pt/crates/).

| Camada | Crates | Por que existe |
| --- | --- | --- |
| Fundações standalone | `appcore-args`, `appcore-supervisor`, `appcore-transport` | componentes reutilizáveis e versionados independentemente, sem dependências AppCore |
| Contratos | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` | manifests, identidades validadas, contratos wire e composição de providers |
| Runtime | `appcore-core`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-log`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-api`, `appcore-update`, `appcore-ai`, `appcore-filemaker` | comportamento e infraestrutura do Runtime com fronteiras explícitas |
| Integrações | `appcore-gateway`, `appcore-provider-vercel-neon`, `appcore-sync-sqlite` | integrações externas ou opcionais de infraestrutura |
| Adapters | `appcore-filemaker-ai`, `appcore-filemaker-cli` | adapters opcionais de modelo e processo ao redor do core FileMaker determinístico |
| Facade | `appcore-sdk` | contratos de aplicação e namespaces opt-in sem composição implícita do host |
| Ferramentas | `appcore-dev`, `runtime-console`, ferramentas de certificação | desenvolvimento, operação e evidência de release; não são crates públicos |

Todos os pacotes públicos são versionados separadamente. As fundações
standalone também continuam reutilizáveis sem dependências AppCore.
`appcore-supervisor` gerencia serviços em processo sem depender do dispatch de
commands; `appcore-args` faz parsing de CLI sem executar comandos do Runtime.

Comece por `appcore-sdk` no código de negócio e desça para um crate owner
somente quando precisar diretamente do contrato de nível inferior. O processo
de deployment compõe providers, serviços, listeners e ciclo de vida
explicitamente; o SDK não esconde esse host dentro da biblioteca da aplicação.

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
