---
title: Future Architecture
description: Conceptual AppCore architecture directions kept separate from the current stable crate map.
sidebar_position: 12
---

# Future Architecture

:::caution Conceptual roadmap
This page describes future architecture ideas. It does **not** change the
current Runtime architecture, the stable crate graph, or the 23 stable public crates
available today.
:::

Future AppCore work follows the same rule as the current Runtime: a crate exists
only when it has a clear owner, consumers, dependency boundary, tests,
publication path and documentation.

## Conceptual Flows

```mermaid
flowchart LR
    Description[Description] --> AI[appcore-ai]
    AI --> UiDocument[UiDocument]
    UiDocument --> UI[appcore-ui]
    UI --> Web[Web surface]
    UI --> Native[Native surface]
```

```mermaid
flowchart LR
    Documents[Documents] --> Search[appcore-search]
    Search --> Lexical[Lexical]
    Search --> Vector[Vector]
    Search --> Hybrid[Hybrid]
    Search --> AI[appcore-ai]
```

```mermaid
flowchart LR
    Goal[Goal] --> Agent[appcore-agent]
    Agent --> Tools[Tools and actions]
    Tools --> Capabilities[appcore-capabilities]
    Agent --> AI[appcore-ai]
```

Deterministic automation and adaptive agents remain separate. Automation is
`Event -> Condition -> Action -> Command`. Agents handle goals, planning, tools,
memory and action proposals through AI and capabilities.

Training, if supported, should be explicit:

```mermaid
flowchart LR
    Request[Training request] --> Jobs[appcore-jobs]
    Jobs --> Training[AI training]
    Training --> Checkpoint[Checkpoint]
```

Media and devices are also boundaries, not hidden dependencies:

```mermaid
flowchart LR
    Media[appcore-media] --> UI[appcore-ui]
    Media --> AI[appcore-ai]
    Device[appcore-device] --> Media
    Device --> AI
    AI --> Command[AppCore Command]
```

Plugins compose extension points:

```mermaid
flowchart LR
    Plugin[appcore-plugin] --> Providers[Providers]
    Plugin --> Backends[AI backends]
    Plugin --> Components[UI components]
    Plugin --> Adapters[Device adapters]
```

## Profiles

The same future components can serve different runtime shapes:

- desktop application;
- AI desktop application;
- distributed backend;
- edge or IoT installation;
- media application;
- agent platform;
- visual development tool.

## Non-Goals

AppCore does not intend to become:

- an operating system;
- a universal database;
- a browser engine;
- a full machine-learning framework;
- a reinvented graphics engine;
- a custom cryptography stack;
- a cloud provider;
- a monolith.

## Principles

- Prefer the Rust standard library or internal crates before adding external dependencies.
- Keep local-first behavior possible.
- Use distributed operation only when the deployment needs it.
- Route extension through capabilities and explicit providers.
- Keep heavy features opt-in.
- Do not let implementation details leak into the central API.
- Require an owner, consumers, DAG position, tests, publication path and docs before creating a crate.

## Maturity

Research means the boundary is still being investigated. Planned means the
boundary is useful enough to reserve. In Design means the public shape is being
worked out. Alpha, Beta and RC indicate increasing implementation and release
confidence. Stable means the crate is published with its own SemVer contract.

Each crate may keep independent SemVer. Promotion is manual and should preserve
URLs where possible.
