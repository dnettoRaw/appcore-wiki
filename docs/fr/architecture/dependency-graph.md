---
title: Graphe de dépendances
sidebar_position: 4
---

# Graphe de dépendances

## Introduction

The dependency graph records service, provider, capability, and leadership requirements before startup.

## Frontière de contrat

L'architecture sépare les exigences portables de l'application des providers appartenant à l'installation. Le code métier implémente le comportement applicatif. Les crates du runtime possèdent l'infrastructure réutilisable et rejettent les fallbacks implicites lorsqu'un provider requis manque.

## Conséquences opérationnelles

| Concern | Runtime behavior | Owner outside the runtime |
| --- | --- | --- |
| Manifest validation | Fails before handlers start | Application author and installer |
| Secret references | Resolved after validation | Secret provider and operator |
| HTTP command/query API | Bounded DTOs and auth checks | TLS termination and edge policy |
| Sync | Sequence and hash-chain validation | Domain conflict policy |
| Supervision | Service restart/degrade/shutdown | OS process manager |

## Flux interne

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

## Exemples

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

## Modes de défaillance à tester

- Missing provider ID.
- Unavailable secret reference.
- Duplicate or malformed authorization header.
- Exhausted lease epoch or stale fencing token.
- Oversized HTTP body, file log, snapshot, or backup.

## Limites

AppCore gives structure for runtime infrastructure. It does not operate your external provider, prove domain correctness, terminate TLS by default, or replace process-level supervision.

## Pages liées

- [Storage Model](/fr/architecture/storage-model)
- [Security Model](/fr/architecture/security-model)
- [Distributed Model](/fr/architecture/distributed-model)
- [Supervisor Crate](/fr/crates/appcore-supervisor)
