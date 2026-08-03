---
title: Grafo de dependências
sidebar_position: 4
---

# Grafo de dependências

## Introdução

The dependency graph records service, provider, capability, and leadership requirements before startup.

## Fronteira de contrato

A arquitetura mantém requisitos portáveis da aplicação separados dos providers pertencentes à instalação. Código de negócio implementa comportamento da aplicação. Crates do runtime controlam infraestrutura reutilizável e rejeitam fallbacks implícitos quando um provider obrigatório está ausente.

## Consequências operacionais

| Concern | Runtime behavior | Owner outside the runtime |
| --- | --- | --- |
| Manifest validation | Fails before handlers start | Application author and installer |
| Secret references | Resolved after validation | Secret provider and operator |
| HTTP command/query API | Bounded DTOs and auth checks | TLS termination and edge policy |
| Sync | Sequence and hash-chain validation | Domain conflict policy |
| Supervision | Service restart/degrade/shutdown | OS process manager |

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

## Modos de falha para testar

- Missing provider ID.
- Unavailable secret reference.
- Duplicate or malformed authorization header.
- Exhausted lease epoch or stale fencing token.
- Oversized HTTP body, file log, snapshot, or backup.

## Limitações

AppCore gives structure for runtime infrastructure. It does not operate your external provider, prove domain correctness, terminate TLS by default, or replace process-level supervision.

## Páginas relacionadas

- [Storage Model](/pt/architecture/storage-model)
- [Security Model](/pt/architecture/security-model)
- [Distributed Model](/pt/architecture/distributed-model)
- [Supervisor Crate](/pt/crates/appcore-supervisor)
