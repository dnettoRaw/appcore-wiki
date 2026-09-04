---
title: Registre des IDs stables des crates
sidebar_position: 1
slug: /crates/registry
---

# Registre des IDs stables des crates

Chaque crate actif possède un ID permanent. Les READMEs pointent vers
`/crates/id/acr-NNN`, pas vers le slug actuel. Le wiki redirige cette URL stable
vers la page courante. Si elle déménage, seuls ce registre et la table de
redirection changent.

Un ID n'est jamais renommé, réattribué ou réutilisé. Un crate retiré conserve
son ID et reçoit une destination historique.

| ID stable | Crate | Couche | Référence actuelle |
|---|---|---|---|
| ACR-001 | `appcore-args` | Standalone | [Ouvrir](/fr/crates/appcore-args) |
| ACR-002 | `appcore-contracts` | Contrat | [Ouvrir](/fr/crates/appcore-contracts) |
| ACR-003 | `appcore-types` | Contrat | [Ouvrir](/fr/crates/appcore-types) |
| ACR-004 | `appcore-transport` | Standalone | [Ouvrir](/fr/crates/appcore-transport) |
| ACR-005 | `appcore-supervisor` | Standalone | [Ouvrir](/fr/crates/appcore-supervisor) |
| ACR-006 | `appcore-distributed-contracts` | Contrat | [Ouvrir](/fr/crates/appcore-distributed-contracts) |
| ACR-007 | `appcore-dnt` | Runtime | [Ouvrir](/fr/crates/appcore-dnt) |
| ACR-008 | `appcore-core` | Runtime | [Ouvrir](/fr/crates/appcore-core) |
| ACR-009 | `appcore-api` | Runtime | [Ouvrir](/fr/crates/appcore-api) |
| ACR-010 | `appcore-security` | Runtime | [Ouvrir](/fr/crates/appcore-security) |
| ACR-011 | `appcore-storage` | Runtime | [Ouvrir](/fr/crates/appcore-storage) |
| ACR-012 | `appcore-sync` | Runtime | [Ouvrir](/fr/crates/appcore-sync) |
| ACR-013 | `appcore-ops` | Runtime | [Ouvrir](/fr/crates/appcore-ops) |
| ACR-014 | `appcore-scheduler` | Runtime | [Ouvrir](/fr/crates/appcore-scheduler) |
| ACR-015 | `appcore-control-plane` | Runtime | [Ouvrir](/fr/crates/appcore-control-plane) |
| ACR-016 | `appcore-capabilities` | Runtime | [Ouvrir](/fr/crates/appcore-capabilities) |
| ACR-017 | `appcore-peer-rpc` | Runtime | [Ouvrir](/fr/crates/appcore-peer-rpc) |
| ACR-018 | `appcore-gateway` | Intégration | [Ouvrir](/fr/crates/appcore-gateway) |
| ACR-019 | `appcore-provider` | Contrat | [Ouvrir](/fr/crates/appcore-provider) |
| ACR-020 | `appcore-provider-vercel-neon` | Intégration | [Ouvrir](/fr/crates/appcore-provider-vercel-neon) |
| ACR-021 | `appcore-update` | Runtime | [Ouvrir](/fr/crates/appcore-update) |
| ACR-022 | `appcore-ai` | Runtime bêta | [Ouvrir](/fr/crates/appcore-ai) |
| ACR-023 | `appcore-filemaker` | Runtime bêta | [Ouvrir](/fr/crates/appcore-filemaker) |
| ACR-024 | `appcore-filemaker-ai` | Adaptateur bêta | [Ouvrir](/fr/crates/appcore-filemaker-ai) |
| ACR-025 | `appcore-filemaker-cli` | Adaptateur bêta | [Ouvrir](/fr/crates/appcore-filemaker-cli) |
| ACR-026 | `appcore-sync-sqlite` | Intégration prerelease | [Ouvrir](/fr/crates/appcore-sync-sqlite) |
| ACR-027 | `appcore-log` | Runtime | [Ouvrir](/fr/crates/appcore-log) |
| ACR-028 | `appcore-sdk` | Façade | [Ouvrir](/fr/crates/appcore-sdk) |

La source de ces associations est la table `stableCrateIds` dans
`docusaurus.config.js`. La table visible doit être révisée avec elle.
