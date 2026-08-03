---
title: Update
sidebar_position: 7
---

# Update

## Introdução

This example focuses on artifact staging and health-gated activation.

## Padrão mínimo

```toml
manifest_version = 1
installation_id = "local-dev"
mode = "standalone"

[providers.storage]
id = "file"
path = "./var/appcore/storage"

[secrets]
runtime_security = "env:APPCORE_RUNTIME_SECRET"
```

## Fluxo

```mermaid
sequenceDiagram
    participant Operator
    participant Update
    participant Trust
    participant Stage
    participant Health
    Operator->>Update: select opaque artifact
    Update->>Trust: verify identity, checksum, and policy
    Update->>Stage: install immutable candidate
    Stage->>Health: run activation gate
    Health-->>Update: accept, hold, or rollback
```

## O que copiar

- Stable command names.
- Idempotency handling.
- Tenant context.
- Explicit provider or transport assumptions.

## O que não copiar cegamente

- In-memory persistence for production.
- Missing authorization policy.
- Unbounded payloads.
- Direct coupling between API routes and storage records.

## Páginas relacionadas

- [Tutorials](/pt/tutorials/todo-app)
- [Concepts](/pt/concepts/commands)
- [Operations](/pt/operations/deployment)
