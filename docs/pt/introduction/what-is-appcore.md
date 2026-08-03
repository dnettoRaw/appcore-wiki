---
title: O que é AppCore
sidebar_position: 1
---

# O que é AppCore

Imagine a mesma aplicação instalada em dois lugares. Em uma loja ela roda em um notebook e precisa continuar funcionando sem internet. Em outra instalação ela roda em cluster, com control plane, leases, Peer RPC e update supervisionado. O código de negócio não deveria ter duas arquiteturas.

AppCore existe para essa fronteira.

Ele não é web framework, banco de dados, ERP ou plataforma de negócio. Ele é um runtime host que torna decisões de infraestrutura explícitas, versionadas e testáveis.

## O problema

Backends comuns acumulam infraestrutura escondida: configuração mistura identidade, paths, secrets e endpoints; retries entram nos handlers; jobs rodam fora do ciclo de vida; update troca arquivos antes de provar health; liderança distribuída vira um booleano sem fencing.

AppCore separa ownership:

| Contrato | Dono | Contém | Não contém |
| --- | --- | --- | --- |
| Application Manifest | aplicação | identidade, compatibilidade, capabilities, requisitos | paths, provider IDs, endpoints, secrets |
| Deployment Manifest | instalação | modo, providers, rede, paths, secret refs, watchdog | regras de negócio, schemas, source |
| Runtime Manifest | runtime | versão observada, node/core, health, plataforma | overrides do usuário |
| Código de negócio | aplicação | commands, queries, handlers, state, decisions | composição do runtime |

```mermaid
flowchart TB
    App[Aplicação externa] --> Host[appcore-bin host]
    Manifest[application.toml] --> Host
    Deployment[deployment.toml] --> Host
    Host --> Providers[Providers selecionados]
    Host --> Services[Serviços supervisionados]
    Host --> API[API command/query]
```

## Quando usar

Use AppCore quando a aplicação precisa de local-first, cluster, commands/queries explícitos, storage durável, backup/restore, health/status, serviços supervisionados, sync com checkpoints, Peer RPC, gateway ou updates com staging, health gate e rollback.

## Quando não usar

Evite quando um servidor HTTP stateless e um banco gerenciado bastam. AppCore não fornece ORM, OAuth, vault gerenciado, terminação TLS universal, RAFT, consenso multi-master ou resolução automática de conflitos de domínio.

Próximo capítulo: [contrato de três artefatos](/pt/architecture/three-artifact-contract).

