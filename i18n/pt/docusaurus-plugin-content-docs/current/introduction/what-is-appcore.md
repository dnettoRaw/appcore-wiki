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
    App[Aplicação externa] --> SDK[appcore-sdk]
    Manifest[application.toml] --> SDK
    Deployment[deployment.toml] --> SDK
    SDK --> Prepared[Registros validados]
    Prepared --> Executable[Executável de deployment]
    Deployment --> Executable
    Executable --> Providers[Providers selecionados]
    Executable --> Services[Serviços supervisionados]
    Executable --> API[API command/query]
```

## O que roda quando uma aplicação AppCore inicia

O código da aplicação usa `App::prepare` para validar manifests e reunir os
registros de negócio. O executável de deployment selecionado então possui a
composição:

```mermaid
sequenceDiagram
    participant Main as main()
    participant SDK as appcore-sdk
    participant Contracts as appcore-contracts
    participant Providers as Provider plan
    participant Core as appcore-core
    participant Supervisor as appcore-supervisor
    participant App as Application
    participant Deployment as Executável de deployment

    Main->>SDK: prepare(application, manifests)
    SDK->>Contracts: validar application.toml
    SDK->>Contracts: validar deployment.toml
    SDK->>App: configure(DeploymentContext validado)
    SDK->>Core: registrar commands, events, states, decisions
    SDK-->>Deployment: registries e callbacks preparados
    Deployment->>Providers: resolver providers explícitos
    Deployment->>Supervisor: registrar serviços selecionados
    Supervisor->>Supervisor: iniciar na ordem das dependências
    Deployment-->>Main: executar até shutdown ou falha de bootstrap
```

Se os dois manifests não tiverem a mesma identidade, o bootstrap falha. Uma
config removida para na update wall com `NO MORE SUPPORTED PLEASE UPDATE`. Um
provider selecionado e ausente também falha, sem fallback silencioso.

## Quando usar

Use AppCore quando a aplicação precisa de local-first, cluster, commands/queries explícitos, storage durável, backup/restore, health/status, serviços supervisionados, sync com checkpoints, Peer RPC, gateway ou updates com staging, health gate e rollback.

## Quando não usar

Evite quando um servidor HTTP stateless e um banco gerenciado bastam. AppCore não fornece ORM, OAuth, vault gerenciado, terminação TLS universal, RAFT, consenso multi-master ou resolução automática de conflitos de domínio.

## Limitations

- AppCore oferece contratos de runtime; ele não escreve o modelo de negócio.
- Deployments ainda precisam escolher providers, paths, secrets e process manager corretamente.
- O runtime valida envelopes e manifests, mas não prova que handlers de domínio estão corretos.
- A linha estável 1.0 prefere falha explícita a compatibilidade automática com formatos antigos.

## Leia depois

Próximo capítulo: [contrato de três artefatos](/architecture/three-artifact-contract).
