---
title: Status do projeto
sidebar_position: 4
---

# Status do projeto

## Introdução

Candidato atual: `1.0.1-rc.8`. Toolchain Rust mínima: `1.89`.

A linha 1.0 é uma linha release-candidate com superfície manifest-first estável. A documentação separa contratos estáveis, perfis de implementação e trabalho experimental.

## Compatibility map

| Area | Status | Practical meaning |
| --- | --- | --- |
| Three-artifact contract | Stable | `application.toml`, `deployment.toml`, and `Application` are the supported application shape |
| Manifest V1 contracts | Stable | Field meanings are versioned for the 1.0 line |
| Runtime lifecycle and command/query dispatch | Stable | Core application integration point |
| Local file storage profile | Implemented | Bounded and explicit; assumes reliable local filesystem semantics |
| Gateway mesh relay | Implemented | Process-local replay/session state; edge/TLS policy remains deployment-owned |
| Sync | Implemented, conservative | Leader-to-follower replication, not consensus |
| TPM and hardware-backed security | Planned/experimental | No 1.0 RC implementation claim |
| UI Runtime, Page Builder, ILM | Experimental | No compatibility promise |

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

## Nunca planejado

- Business workflows.
- OAuth provider implementation.
- Managed vault.
- General database engine.
- Transparent multi-master consensus.

## Páginas relacionadas

- [Roadmap](/pt/development/roadmap)
- [Security overview](/pt/security/overview)
- [Update model](/pt/architecture/update-model)
