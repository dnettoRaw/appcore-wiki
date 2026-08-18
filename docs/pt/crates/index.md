---
title: Catálogo de crates
sidebar_position: 0
slug: /pt/crates/
---

# Catálogo de crates

O AppCore Runtime `1.0.1-rc.8` é composto por **21 crates de Runtime**. Os 21
foram verificados como publicados no crates.io em 18 de agosto de 2026 e
declaram MSRV Rust `1.89`. As ferramentas `appcore-certification` e
`runtime-console` fazem parte do workspace, mas não entram nessa contagem.

Para criar uma aplicação, use a facade de alto nível:

```bash
cargo add appcore-bin@1.0.1-rc.8
```

Dependa diretamente de outro crate apenas para um consumidor de baixo nível ou
um adapter de provider. Cada página registra responsabilidade, dependências
AppCore diretas, API principal, limites, maturidade e links exatos para
crates.io e docs.rs.

| # | Crate | Responsabilidade | Dependências AppCore diretas |
| ---: | --- | --- | --- |
| 1 | [appcore-contracts](./appcore-contracts) | Manifests e policies versionados | Nenhuma |
| 2 | [appcore-types](./appcore-types) | Identidade, trace e erros validados | contracts |
| 3 | [appcore-transport](./appcore-transport) | Transporte HTTP/TLS limitado | Nenhuma |
| 4 | [appcore-supervisor](./appcore-supervisor) | Lifecycle de serviços e budgets de restart | Nenhuma |
| 5 | [appcore-distributed-contracts](./appcore-distributed-contracts) | Contratos wire/provider distribuídos | contracts, types |
| 6 | [appcore-dnt](./appcore-dnt) | Contêiner binário cifrado e autenticado | contracts, types |
| 7 | [appcore-core](./appcore-core) | Lifecycle, registries e dispatch | contracts, types |
| 8 | [appcore-api](./appcore-api) | Host HTTP e DTOs do Runtime | core, security, supervisor |
| 9 | [appcore-security](./appcore-security) | Tokens, secrets, keyring e policy | core, DNT |
| 10 | [appcore-storage](./appcore-storage) | Contratos de storage, file provider e backup | contracts, DNT, security, types |
| 11 | [appcore-sync](./appcore-sync) | Replicação conservadora leader-to-follower | core, distributed contracts, ops, transport |
| 12 | [appcore-ops](./appcore-ops) | Health e observabilidade independente de vendor | core |
| 13 | [appcore-scheduler](./appcore-scheduler) | Scheduling local limitado e placement | contracts, core |
| 14 | [appcore-control-plane](./appcore-control-plane) | Presença, discovery, heartbeat e leases | contracts, core, distributed contracts, transport |
| 15 | [appcore-capabilities](./appcore-capabilities) | Registry e resolução de capabilities | contracts, core, distributed contracts |
| 16 | [appcore-peer-rpc](./appcore-peer-rpc) | Chamadas peer autenticadas e replay defense | core, distributed contracts, security, transport |
| 17 | [appcore-gateway](./appcore-gateway) | Relay WebSocket e mesh isolado por tenant | contracts, core, distributed contracts, peer RPC, security, transport, types |
| 18 | [appcore-provider](./appcore-provider) | Composição de providers e shared leases | contracts |
| 19 | [appcore-provider-vercel-neon](./appcore-provider-vercel-neon) | Adapter oficial isolado Vercel/Neon | contracts, control plane, provider |
| 20 | [appcore-update](./appcore-update) | Verificação, ativação e rollback de artifacts | contracts, provider |
| 21 | [appcore-bin](./appcore-bin) | Facade de aplicação, CLI e composition root | 15 crates do Runtime |

O grafo de dependências é acíclico. Código público de aplicação normalmente
deve parar em `appcore_bin::application`; estar publicado não torna um crate
automaticamente uma superfície recomendada para aplicações.
