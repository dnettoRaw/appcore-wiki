---
title: Stable Crate ID Registry
sidebar_position: 1
slug: /crates/registry
---

# Stable Crate ID Registry

Every active crate has one permanent documentation ID. READMEs link to
`/crates/id/acr-NNN`, not to the current page slug. The wiki redirects that
stable URL to the current page. If a page moves, only this registry and the
redirect map change.

IDs are never renamed, reassigned, or reused. A retired crate keeps its ID and
receives a historical destination.

| Stable ID | Crate | Layer | Current reference |
|---|---|---|---|
| ACR-001 | `appcore-args` | Standalone | [Open](/crates/appcore-args) |
| ACR-002 | `appcore-contracts` | Contract | [Open](/crates/appcore-contracts) |
| ACR-003 | `appcore-types` | Contract | [Open](/crates/appcore-types) |
| ACR-004 | `appcore-transport` | Standalone | [Open](/crates/appcore-transport) |
| ACR-005 | `appcore-supervisor` | Standalone | [Open](/crates/appcore-supervisor) |
| ACR-006 | `appcore-distributed-contracts` | Contract | [Open](/crates/appcore-distributed-contracts) |
| ACR-007 | `appcore-dnt` | Runtime | [Open](/crates/appcore-dnt) |
| ACR-008 | `appcore-core` | Runtime | [Open](/crates/appcore-core) |
| ACR-009 | `appcore-api` | Runtime | [Open](/crates/appcore-api) |
| ACR-010 | `appcore-security` | Runtime | [Open](/crates/appcore-security) |
| ACR-011 | `appcore-storage` | Runtime | [Open](/crates/appcore-storage) |
| ACR-012 | `appcore-sync` | Runtime | [Open](/crates/appcore-sync) |
| ACR-013 | `appcore-ops` | Runtime | [Open](/crates/appcore-ops) |
| ACR-014 | `appcore-scheduler` | Runtime | [Open](/crates/appcore-scheduler) |
| ACR-015 | `appcore-control-plane` | Runtime | [Open](/crates/appcore-control-plane) |
| ACR-016 | `appcore-capabilities` | Runtime | [Open](/crates/appcore-capabilities) |
| ACR-017 | `appcore-peer-rpc` | Runtime | [Open](/crates/appcore-peer-rpc) |
| ACR-018 | `appcore-gateway` | Integration | [Open](/crates/appcore-gateway) |
| ACR-019 | `appcore-provider` | Contract | [Open](/crates/appcore-provider) |
| ACR-020 | `appcore-provider-vercel-neon` | Integration | [Open](/crates/appcore-provider-vercel-neon) |
| ACR-021 | `appcore-update` | Runtime | [Open](/crates/appcore-update) |
| ACR-022 | `appcore-ai` | Runtime beta | [Open](/crates/appcore-ai) |
| ACR-023 | `appcore-filemaker` | Runtime beta | [Open](/crates/appcore-filemaker) |
| ACR-024 | `appcore-filemaker-ai` | Adapter beta | [Open](/crates/appcore-filemaker-ai) |
| ACR-025 | `appcore-filemaker-cli` | Adapter beta | [Open](/crates/appcore-filemaker-cli) |
| ACR-026 | `appcore-sync-sqlite` | Integration prerelease | [Open](/crates/appcore-sync-sqlite) |
| ACR-027 | `appcore-log` | Runtime | [Open](/crates/appcore-log) |
| ACR-028 | `appcore-sdk` | Facade | [Open](/crates/appcore-sdk) |

The source of truth for these mappings is the `stableCrateIds` table in
`docusaurus.config.js`. The visible table is reviewed with it.
