---
title: Project Status
sidebar_position: 4
---

# Project Status

## Introduction

Current candidate: `1.0.1-rc.8`. Minimum Rust toolchain: `1.89`.

The 1.0 line is a release-candidate line with a stable manifest-first surface. Documentation should distinguish stable contracts from implementation profiles and experimental work.

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

## Never planned

- Business workflows.
- OAuth provider implementation.
- Managed vault.
- General database engine.
- Transparent multi-master consensus.

## Related pages

- [Roadmap](/en/development/roadmap)
- [Security overview](/en/security/overview)
- [Update model](/en/architecture/update-model)
