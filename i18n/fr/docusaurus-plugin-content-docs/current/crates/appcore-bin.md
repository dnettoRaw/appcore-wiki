---
title: appcore-bin
sidebar_position: 22
---

# appcore-bin

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-bin)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-bin/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** façade manifest-first, CLI et composition root.

**Dépendances internes :** tous les crates service/composition.

**API application :** `Application`, `run_application`,
`ManifestApplicationHost`, `ApplicationServiceReport`, `DeploymentContext`,
volumes/environment résolus et `ApplicationTaskRegistry`.

**API host :** bootstrap/config errors/results, CLI, paths/lifecycle local,
server entry points, build info et outils auth-server optionnels.

Les deux binaires traitent une entrée UTF-8 bornée avec `appcore-args`. L'aide,
la validation et la complétion dynamique Bash, Zsh, Fish et PowerShell
partagent une spécification déclarative; l'exécution reste dans ce crate.

Le manifeste distribué final alimente un catalogue unique
`appcore-capabilities` pendant le bootstrap. La façade directe, le HTTP
applicatif et le peer RPC utilisent le même owner pour l'enforcement de
déclaration, mode, idempotence, écriture opérationnelle et leadership. Les
queries de statut Runtime restent un comportement explicite du host.

C'est la dépendance recommandée des applications. Il possède chargement des
manifests, providers, lifecycle, HTTP, sync, peer RPC, control plane,
scheduling, supervision, updates et shutdown.

Les applications utilisent le module public `application` et évitent internals.

**Maturité :** façade manifest-first RC stable; internals restent détails.
