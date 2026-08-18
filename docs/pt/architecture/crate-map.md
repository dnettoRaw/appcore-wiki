---
title: Mapa de crates
sidebar_position: 12
---

# Mapa de crates

Quando um runtime cresce, os limites entre crates precisam explicar a arquitetura. No AppCore eles seguem ownership, não conveniência.

O workspace `1.0.1-rc.8` atual contém 21 crates de Runtime, todos publicados no
crates.io. A referência individual está no [catálogo de crates](/pt/crates/).

| Camada | Crates | Por que existe |
| --- | --- | --- |
| Base | `appcore-contracts`, `appcore-types`, `appcore-transport`, `appcore-dnt` | contratos reutilizáveis, IDs validados, transporte limitado e envelopes cifrados sem composição concreta |
| Lifecycle | `appcore-supervisor` | grafo de serviços, restart policy, watchdog e quarentena independentes do dispatch |
| Core | `appcore-core` | registries de command/event/state/decision, identidade, lifecycle, audit e idempotência |
| Serviços do Runtime | `appcore-api`, `appcore-storage`, `appcore-security`, `appcore-ops`, `appcore-scheduler`, `appcore-sync` | uma responsabilidade de infraestrutura por crate |
| Distribuição | `appcore-distributed-contracts`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-gateway` | contratos wire, presença, discovery, leases, roteamento de capabilities, peer transport e relay Gateway |
| Composição | `appcore-provider`, `appcore-update`, `appcore-provider-vercel-neon` | factories de provider, planos de deployment, adapters oficiais e lifecycle de update |
| Host | `appcore-bin` | único crate autorizado a compor infraestrutura concreta para aplicações |
| Tools | `runtime-console`, ferramentas de certificação | workflows de operador e evidência de release |

As tools são utilitários do workspace e não entram na contagem dos 21 crates do
Runtime.

`appcore-bin` é o único composition root concreto para aplicações. Contratos não dependem de implementações, e código de negócio não deve importar módulos privados do host.

## Limitations

- Este mapa explica ownership; use o [catálogo de crates](/pt/crates/) para
  APIs, limites, maturidade e links do registry.
- Crates de tooling/certificação podem não ser superfície estável de aplicação.
- Módulos internos podem mudar mesmo quando manifests e facade pública continuam compatíveis.
