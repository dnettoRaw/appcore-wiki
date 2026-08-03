---
title: Capabilities
sidebar_position: 6
---

# Capabilities

## Introdução

Capabilities are named contracts used to bind services and providers without depending on concrete implementations.

## Regras de decisão

- Make the tenant boundary explicit.
- Prefer validated typed IDs from shared runtime types over raw strings at boundaries.
- Record accepted work before observable state changes.
- Bound payloads, files, queues, retries, and timeouts.
- Make degraded state visible instead of hiding it behind retries.

## Fluxo interno

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

## Exemplos

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

## O que iniciantes costumam perder

- A retry is part of the contract, not an exception.
- A projection is not the source of durable truth.
- A provider name is infrastructure, not product meaning.
- Leadership without fencing is not enough.

## Limitações

This concept explains the runtime boundary. Application-specific invariants, schemas, user-facing behavior, and external provider operation remain outside the concept itself.

## Páginas relacionadas

- [Commands](/pt/concepts/commands)
- [Storage Model](/pt/architecture/storage-model)
- [Security Overview](/pt/security/overview)
