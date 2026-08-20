---
title: appcore-types
sidebar_position: 3
---

# appcore-types

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-types/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-types/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-types)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** identifiants validés, identity et trace partagés par les
contrats.

**Dépendances internes :** `appcore-contracts`.

**API principale :** IDs application, node, tenant, cluster, Core, instance,
command, event, query, state et capability; `RuntimeIdentity`, `CoreIdentity`,
policies/status de version, `TraceContext`, `RuntimeError`,
`RuntimeResult`.

Utiliser ces types au lieu de strings non validées aux frontières. Ne pas y
placer état d'implémentation, I/O ou comportement provider.

**Maturité :** surface fondamentale stable.
