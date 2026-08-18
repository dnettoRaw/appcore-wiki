---
title: appcore-bin
sidebar_position: 21
---

# appcore-bin

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-bin)
:::


**Responsabilidade:** facade manifest-first, CLI e composition root.

**Dependências AppCore diretas:** `appcore-api`, `appcore-capabilities`, `appcore-contracts`, `appcore-control-plane`, `appcore-core`, `appcore-ops`, `appcore-peer-rpc`, `appcore-provider`, `appcore-provider-vercel-neon`, `appcore-scheduler`, `appcore-security`, `appcore-storage`, `appcore-supervisor`, `appcore-sync`, `appcore-update`.

**API de aplicação:** `Application`, `run_application`,
`ManifestApplicationHost`, `ApplicationServiceReport`, `DeploymentContext`,
volumes/environment resolvidos e `ApplicationTaskRegistry`.

**API de host:** bootstrap/config errors/results, CLI, paths/lifecycle local,
server entry points, build info e ferramentas opcionais de auth-server.

É a dependência recomendada para aplicações. Possui carregamento de manifests,
providers, lifecycle, HTTP, sync, peer RPC, control plane, scheduling,
supervision, updates e shutdown.

Aplicações usam o módulo público `application` e evitam internals.

**Maturidade:** facade manifest-first RC estável; internals são detalhes.
