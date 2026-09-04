---
title: Registro de IDs estáveis dos crates
sidebar_position: 1
slug: /crates/registry
---

# Registro de IDs estáveis dos crates

Cada crate ativo possui um ID permanente. Os READMEs apontam para
`/crates/id/acr-NNN`, não para o slug atual. A wiki redireciona essa URL estável
para a página vigente. Se a página mudar, somente este registro e o mapa de
redirects são alterados.

IDs nunca são renomeados, reatribuídos ou reutilizados. Um crate aposentado
mantém o ID e recebe um destino histórico.

| ID estável | Crate | Camada | Referência atual |
|---|---|---|---|
| ACR-001 | `appcore-args` | Standalone | [Abrir](/pt/crates/appcore-args) |
| ACR-002 | `appcore-contracts` | Contrato | [Abrir](/pt/crates/appcore-contracts) |
| ACR-003 | `appcore-types` | Contrato | [Abrir](/pt/crates/appcore-types) |
| ACR-004 | `appcore-transport` | Standalone | [Abrir](/pt/crates/appcore-transport) |
| ACR-005 | `appcore-supervisor` | Standalone | [Abrir](/pt/crates/appcore-supervisor) |
| ACR-006 | `appcore-distributed-contracts` | Contrato | [Abrir](/pt/crates/appcore-distributed-contracts) |
| ACR-007 | `appcore-dnt` | Runtime | [Abrir](/pt/crates/appcore-dnt) |
| ACR-008 | `appcore-core` | Runtime | [Abrir](/pt/crates/appcore-core) |
| ACR-009 | `appcore-api` | Runtime | [Abrir](/pt/crates/appcore-api) |
| ACR-010 | `appcore-security` | Runtime | [Abrir](/pt/crates/appcore-security) |
| ACR-011 | `appcore-storage` | Runtime | [Abrir](/pt/crates/appcore-storage) |
| ACR-012 | `appcore-sync` | Runtime | [Abrir](/pt/crates/appcore-sync) |
| ACR-013 | `appcore-ops` | Runtime | [Abrir](/pt/crates/appcore-ops) |
| ACR-014 | `appcore-scheduler` | Runtime | [Abrir](/pt/crates/appcore-scheduler) |
| ACR-015 | `appcore-control-plane` | Runtime | [Abrir](/pt/crates/appcore-control-plane) |
| ACR-016 | `appcore-capabilities` | Runtime | [Abrir](/pt/crates/appcore-capabilities) |
| ACR-017 | `appcore-peer-rpc` | Runtime | [Abrir](/pt/crates/appcore-peer-rpc) |
| ACR-018 | `appcore-gateway` | Integração | [Abrir](/pt/crates/appcore-gateway) |
| ACR-019 | `appcore-provider` | Contrato | [Abrir](/pt/crates/appcore-provider) |
| ACR-020 | `appcore-provider-vercel-neon` | Integração | [Abrir](/pt/crates/appcore-provider-vercel-neon) |
| ACR-021 | `appcore-update` | Runtime | [Abrir](/pt/crates/appcore-update) |
| ACR-022 | `appcore-ai` | Runtime beta | [Abrir](/pt/crates/appcore-ai) |
| ACR-023 | `appcore-filemaker` | Runtime beta | [Abrir](/pt/crates/appcore-filemaker) |
| ACR-024 | `appcore-filemaker-ai` | Adaptador beta | [Abrir](/pt/crates/appcore-filemaker-ai) |
| ACR-025 | `appcore-filemaker-cli` | Adaptador beta | [Abrir](/pt/crates/appcore-filemaker-cli) |
| ACR-026 | `appcore-sync-sqlite` | Integração prerelease | [Abrir](/pt/crates/appcore-sync-sqlite) |
| ACR-027 | `appcore-log` | Runtime | [Abrir](/pt/crates/appcore-log) |
| ACR-028 | `appcore-sdk` | Fachada | [Abrir](/pt/crates/appcore-sdk) |

A fonte desses mapeamentos é a tabela `stableCrateIds` em
`docusaurus.config.js`. A tabela visível deve ser revisada junto dela.
