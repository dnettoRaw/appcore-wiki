---
title: Déploiement
sidebar_position: 1
---

# Déploiement

## Introduction

Operations covers packaging, manifests, provider availability, TLS boundaries, startup gates, and rollback.

## Forme du runbook

1. Confirm the runtime version and manifest versions.
2. Validate provider availability and secret references.
3. Check service health and degraded reasons.
4. Inspect bounded logs and metrics using correlation IDs.
5. Decide whether to retry, degrade, roll back, restore, or stop.

## Commands

```bash
make doctor
make docs.check
make verify
make ci
make release.local
```

## Flux interne

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

## Checklist opérateur

- Do not set `require_auth = false` on an untrusted listener.
- Keep inbound TLS and edge policy explicit.
- Rehearse restore before relying on backups.
- Treat unavailable providers as bootstrap failures, not fallback opportunities.
- Keep process supervision outside the runtime supervisor.

## Limites

AppCore exposes operational state and contracts. It does not operate cloud accounts, rotate external credentials automatically, provision TLS, or choose customer-specific backup retention.

## Pages liées

- [Secure Deployment](/fr/security/secure-deployment)
- [Supervisor](/fr/crates/appcore-supervisor)
- [Troubleshooting](/fr/operations/troubleshooting)
