---
title: appcore-bin
sidebar_position: 21
---

# appcore-bin

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-bin)
:::


**Responsabilité :** façade manifest-first, CLI et composition root.

**Dépendances AppCore directes :** `appcore-api`, `appcore-capabilities`, `appcore-contracts`, `appcore-control-plane`, `appcore-core`, `appcore-ops`, `appcore-peer-rpc`, `appcore-provider`, `appcore-provider-vercel-neon`, `appcore-scheduler`, `appcore-security`, `appcore-storage`, `appcore-supervisor`, `appcore-sync`, `appcore-update`.

**API application :** `Application`, `run_application`,
`ManifestApplicationHost`, `ApplicationServiceReport`, `DeploymentContext`,
volumes/environment résolus et `ApplicationTaskRegistry`.

**API host :** bootstrap/config errors/results, CLI, paths/lifecycle local,
server entry points, build info et outils auth-server optionnels.

C'est la dépendance recommandée des applications. Il possède chargement des
manifests, providers, lifecycle, HTTP, sync, peer RPC, control plane,
scheduling, supervision, updates et shutdown.

Les applications utilisent le module public `application` et évitent internals.

**Maturité :** façade manifest-first RC stable; internals restent détails.
