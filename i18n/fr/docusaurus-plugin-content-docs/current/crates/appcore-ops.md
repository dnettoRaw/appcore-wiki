---
title: appcore-ops
sidebar_position: 13
---

# appcore-ops

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-ops/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-ops/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-ops)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** health, logs, métriques, observations, heartbeat et
availability sans vendor.

**Dépendances internes :** `appcore-core`, `appcore-supervisor`.

**API principale :** health status/report/checks, heartbeat sources, loggers,
metric counters, `ObservationEvent`/`ObservationSink`, file sink borné,
availability report et reexports de compatibilité pour
`appcore-supervisor::managed_services`.

À utiliser pour signaux génériques. Le nouveau code lifecycle utilise
`appcore-supervisor` directement. Ne pas ajouter de SDK vendor ni métriques
métier applicatives au crate.

**Maturité :** primitives stables; export/collection production appartient
au déploiement.
