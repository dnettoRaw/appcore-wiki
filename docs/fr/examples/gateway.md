---
title: Gateway
sidebar_position: 6
---

# Gateway

## Introduction

This example focuses on tenant-aware gateway routing through opaque peer envelopes.

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
flowchart TD
    CP[Control plane] --> P[Presence and discovery]
    CP --> L[Service-scoped leases]
    L --> F[Fencing token]
    F --> W[Protected write]
    P --> RPC[Peer RPC]
    RPC --> SYNC[Sync receiver]
    SYNC --> C[Checkpoint]
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
