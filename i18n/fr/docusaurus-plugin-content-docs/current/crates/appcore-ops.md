---
title: appcore-ops
sidebar_position: 12
---

# appcore-ops

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-ops/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-ops/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-ops)
:::


**Responsabilité :** health, logs, métriques, observations, heartbeat et
availability sans vendor.

**Dépendance AppCore directe :** `appcore-core`.

**API principale :** health status/report/checks, heartbeat sources, loggers,
metric counters, `ObservationEvent`/`ObservationSink`, file sink borné et
rapports d'availability.

À utiliser pour les signaux génériques. Le lifecycle des services appartient à
`appcore-supervisor` ; `appcore-ops` n'expose plus de second Supervisor ni
d'aliases de compatibilité. Ne pas ajouter de SDK vendor ni de métriques métier
applicatives au crate.

**Maturité :** primitives RC stables; export/collection production appartient
au déploiement.
