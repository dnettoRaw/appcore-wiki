---
title: appcore-types
sidebar_position: 2
---

# appcore-types

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-types/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-types/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-types)
:::


**Responsabilité :** identifiants validés, identity et trace partagés par les
contrats.

**Dépendances AppCore directes :** `appcore-contracts`.

**API principale :** IDs application, node, tenant, cluster, Core, instance,
command, event, query, state et capability; `RuntimeIdentity`, `CoreIdentity`,
policies/status de version, `TraceContext`, `RuntimeError`,
`RuntimeResult`.

Utiliser ces types au lieu de strings non validées aux frontières. Ne pas y
placer état d'implémentation, I/O ou comportement provider.

**Maturité :** surface fondamentale RC stable.
