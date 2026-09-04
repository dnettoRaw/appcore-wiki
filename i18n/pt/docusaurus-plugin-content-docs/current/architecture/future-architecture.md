---
title: Arquitetura futura
description: Direções conceituais de arquitetura AppCore mantidas separadas do crate map estável atual.
sidebar_position: 12
---

# Arquitetura futura

:::caution Roadmap conceitual
Esta página descreve ideias de arquitetura futura. Ela **não** altera a
arquitetura atual do Runtime nem o catálogo atual de crates públicos.
:::

Trabalho futuro no AppCore segue a mesma regra do Runtime atual: uma crate só
existe quando possui dono claro, consumidores, fronteira de dependências,
testes, caminho de publicação e documentação.

## Fluxos Conceituais

```mermaid
flowchart LR
    Description[Descrição] --> AI[appcore-ai]
    AI --> UiDocument[UiDocument]
    UiDocument --> UI[appcore-ui]
    UI --> Web[Web surface]
    UI --> Native[Native surface]
```

```mermaid
flowchart LR
    Documents[Documentos] --> Search[appcore-search]
    Search --> Lexical[Lexical]
    Search --> Vector[Vector]
    Search --> Hybrid[Hybrid]
    Search --> AI[appcore-ai]
```

```mermaid
flowchart LR
    Goal[Objetivo] --> Agent[appcore-agent]
    Agent --> Tools[Ferramentas e ações]
    Tools --> Capabilities[appcore-capabilities]
    Agent --> AI[appcore-ai]
```

Automação determinística e agentes adaptativos permanecem separados.
Automação é `Event -> Condition -> Action -> Command`. Agentes lidam com
objetivos, planejamento, ferramentas, memória e propostas de ação por IA e
capabilities.

Training, se suportado, deve ser explícito:

```mermaid
flowchart LR
    Request[Training request] --> Jobs[appcore-jobs]
    Jobs --> Training[AI training]
    Training --> Checkpoint[Checkpoint]
```

Media e devices também são fronteiras:

```mermaid
flowchart LR
    Media[appcore-media] --> UI[appcore-ui]
    Media --> AI[appcore-ai]
    Device[appcore-device] --> Media
    Device --> AI
    AI --> Command[AppCore Command]
```

Plugins compõem pontos de extensão:

```mermaid
flowchart LR
    Plugin[appcore-plugin] --> Providers[Providers]
    Plugin --> Backends[AI backends]
    Plugin --> Components[UI components]
    Plugin --> Adapters[Device adapters]
```

## Perfis

- aplicação desktop;
- aplicação desktop com IA;
- backend distribuído;
- instalação edge ou IoT;
- aplicação de mídia;
- plataforma de agentes;
- ferramenta visual de desenvolvimento.

## Não Objetivos

AppCore não pretende virar:

- sistema operacional;
- database universal;
- browser engine;
- framework completo de machine learning;
- graphics engine reinventado;
- stack criptográfica própria;
- cloud provider;
- monólito.

## Princípios

- Preferir standard library Rust ou crates internos antes de dependências externas.
- Manter comportamento local-first possível.
- Usar distribuição apenas quando o deployment precisa.
- Rotear extensões por capabilities e providers explícitos.
- Manter features pesadas opt-in.
- Não deixar detalhes de implementação vazarem na API central.
- Exigir dono, consumidores, posição no DAG, testes, publicação e docs antes de criar uma crate.

## Maturidade

Research significa que a fronteira ainda está sob investigação. Planned reserva
uma fronteira útil. In Design indica que a forma pública está sendo desenhada.
Alpha, Beta e RC indicam confiança crescente de implementação e release. Stable
significa crate publicada com contrato SemVer próprio.
