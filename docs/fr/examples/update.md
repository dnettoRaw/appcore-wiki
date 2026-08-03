---
title: Update
sidebar_position: 7
---

# Update

## Introduction

This example focuses on artifact staging and health-gated activation.

## Motif minimal

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

## Flux

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

## Ce qu'il faut copier

- Stable command names.
- Idempotency handling.
- Tenant context.
- Explicit provider or transport assumptions.

## Ce qu'il ne faut pas copier aveuglément

- In-memory persistence for production.
- Missing authorization policy.
- Unbounded payloads.
- Direct coupling between API routes and storage records.

## Pages liées

- [Tutorials](/fr/tutorials/todo-app)
- [Concepts](/fr/concepts/commands)
- [Operations](/fr/operations/deployment)
