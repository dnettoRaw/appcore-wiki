---
title: Feuille de route
sidebar_position: 7
---

# Feuille de route

## Introduction

La feuille de route est organisée par compatibilité, pas par enthousiasme.

## Implémenté

- Manifest-first application facade.
- Runtime lifecycle and low-level SDK compatibility.
- HTTP command/query/status DTOs.
- Local file storage and backup contracts.
- Security token, secret reference, policy, and DNT contracts.
- Supervisor, scheduler, control plane, peer RPC, gateway, and update crates.

## Stable

- `ApplicationManifestV1`.
- `DeploymentManifestV1`.
- Three-artifact application model.
- Provider selection semantics with no silent fallback.
- Runtime crate boundary rules.

## Experimental

- ILM.
- UI Runtime.
- Page Builder.
- TPM and hardware-backed security provider split.

## Planifié

- More provider conformance fixtures.
- Additional gateway deployment profiles.
- Stronger update certification evidence.
- Expanded failure-injection examples.

## Idées futures

- Declarative fleet policy.
- Runtime-assisted schema evolution.
- Sync conflict visualization.

## Never Planned

- ERP/business workflows.
- OAuth provider.
- Managed vault.
- General database engine.
- Multi-master consensus.

## Pages liées

- [Statut du projet](/fr/introduction/project-status)
- [Contributing](/fr/development/contributing)
- [Experimental](/fr/experimental/future-plans)
