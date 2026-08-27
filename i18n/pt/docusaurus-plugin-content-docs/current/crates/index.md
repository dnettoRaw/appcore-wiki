---
title: Catálogo de crates
sidebar_position: 0
slug: /crates/
---

# Catálogo de crates

O AppCore `1.0.0` expõe **22 crates públicos**, todos publicados no crates.io e
com MSRV Rust `1.89`. Cada crate público agora possui SemVer independente; uma
mudança em um crate não força pacotes não relacionados a publicar ou adotar a
mesma versão. Ferramentas como
`appcore-certification`, `appcore-dev` e `runtime-console` não são crates
públicos do Runtime.

A beta pública [`appcore-ai 0.1.0-beta.3`](./appcore-ai), versionada
separadamente, também está publicada no crates.io. Ela não faz parte do grafo
estável de crates do Runtime `1.0.0`.

A integração opcional
[`appcore-sync-sqlite 0.1.0-alpha.2`](./appcore-sync-sqlite) é uma prerelease
pós-1.0 publicada. Sua página documenta a fronteira aceita e a evidência de
certificação sem apresentá-la como parte do catálogo estável. O grafo
coordenado histórico está disponível como `2.0.0-alpha.1`; os novos candidatos
são versionados por crate e a orientação estável para aplicações permanece em
`1.0.0`.

O trem de release do repositório está atualmente em `1.0.2-rc`, com trabalho
compatível avançando para 1.5 somente nos crates responsáveis:

| Linha candidata | Crates |
|---|---|
| Releases independentes existentes | `appcore-ai 0.1.0-beta.3`, `appcore-args 1.0.1`, `appcore-supervisor 1.0.1`, `appcore-transport 1.1.0-alpha.1` |
| `0.1.0-alpha.3` | `appcore-sync-sqlite` |
| `1.0.2-rc` | contracts, types, DNT, core, ops, control plane, capabilities, contratos de provider, adapter Vercel/Neon, update |
| `1.5.0-alpha.1` | API, security, storage, peer RPC |
| `2.0.0-alpha.2` | contratos distribuídos, sync, scheduler, Gateway e host de composição; cada um mantém uma quebra pública comprovada em vez de ser rotulado incorretamente como 1.5 |

Candidato significa versão declarada no código, não publicação concluída. O
crates.io continua sendo a autoridade para versões disponíveis.

Para criar uma aplicação, use a facade de alto nível:

```bash
cargo add appcore-bin@1.0.0
```

Dependa diretamente de outro crate apenas para um consumidor de baixo nível ou
um adapter de provider. Cada página registra responsabilidade, fronteira de
dependências, limites importantes, links do registry, guia e exemplos básico e
intermediário mantidos pelo crate.

| # | Crate | Responsabilidade | Dependências AppCore diretas |
| ---: | --- | --- | --- |
| 1 | [appcore-args](./appcore-args) | Parsing de CLI, help e completion limitados | Nenhuma |
| 2 | [appcore-contracts](./appcore-contracts) | Manifests e policies versionados | Nenhuma |
| 3 | [appcore-types](./appcore-types) | Identidade, trace e erros validados | contracts |
| 4 | [appcore-transport](./appcore-transport) | Transporte HTTP/TLS limitado | Nenhuma |
| 5 | [appcore-supervisor](./appcore-supervisor) | Lifecycle de serviços e budgets de restart | Nenhuma |
| 6 | [appcore-distributed-contracts](./appcore-distributed-contracts) | Contratos wire/provider distribuídos | contracts, types |
| 7 | [appcore-dnt](./appcore-dnt) | Contêiner binário cifrado e autenticado | contracts, types |
| 8 | [appcore-core](./appcore-core) | Lifecycle, registries e dispatch | contracts, types |
| 9 | [appcore-api](./appcore-api) | Host HTTP e DTOs do Runtime | core, security, supervisor |
| 10 | [appcore-security](./appcore-security) | Tokens, secrets, keyring e policy | core, DNT |
| 11 | [appcore-storage](./appcore-storage) | Contratos de storage, file provider e backup | contracts, DNT, security, types |
| 12 | [appcore-sync](./appcore-sync) | Replicação conservadora leader-to-follower | core, distributed contracts, ops, transport |
| 13 | [appcore-ops](./appcore-ops) | Health e observabilidade independente de vendor | core |
| 14 | [appcore-scheduler](./appcore-scheduler) | Scheduling local limitado e placement | contracts, core |
| 15 | [appcore-control-plane](./appcore-control-plane) | Presença, discovery, heartbeat e leases | contracts, core, distributed contracts, transport |
| 16 | [appcore-capabilities](./appcore-capabilities) | Registry e resolução de capabilities | contracts, core, distributed contracts |
| 17 | [appcore-peer-rpc](./appcore-peer-rpc) | Chamadas peer autenticadas e replay defense | core, distributed contracts, security, transport |
| 18 | [appcore-gateway](./appcore-gateway) | Relay WebSocket e mesh isolado por tenant | contracts, distributed contracts, peer RPC, security, transport, types |
| 19 | [appcore-provider](./appcore-provider) | Composição de providers e shared leases | contracts |
| 20 | [appcore-provider-vercel-neon](./appcore-provider-vercel-neon) | Adapter oficial isolado Vercel/Neon | contracts, control plane, provider |
| 21 | [appcore-update](./appcore-update) | Verificação, ativação e rollback de artifacts | contracts, provider |
| 22 | [appcore-bin](./appcore-bin) | Facade de aplicação, CLI e composition root | 17 crates AppCore |

O grafo de dependências é acíclico. Código público de aplicação normalmente
deve parar em `appcore_bin::application`; estar publicado não torna um crate
automaticamente uma superfície recomendada para aplicações.

A beta do `appcore-ai`, a prévia em design do [appcore-ui](./appcore-ui) e os
componentes futuros são acompanhados separadamente no
[Roadmap futuro](/roadmap/) para que trabalho pré-estável e planejado não seja
confundido com o grafo estável de crates.

## Propriedade da documentação

Arquitetura e integração de todo o Runtime ficam neste wiki. APIs detalhadas e
exemplos executáveis ficam em `crates/<crate>/wiki` no repositório do Runtime,
para que mudem junto com o código. Cada crate público mantém guia e exemplos
básico e intermediário em inglês, português e francês.
