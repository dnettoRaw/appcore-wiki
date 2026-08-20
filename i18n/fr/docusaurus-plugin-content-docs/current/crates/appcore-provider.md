---
title: appcore-provider
sidebar_position: 19
---

# appcore-provider

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-provider/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-provider)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** factories, registry, deployment plans, contrats
coordination/job et résolution secret indépendants des implémentations.

**Dépendances internes :** `appcore-contracts`.

**API principale :** `ProviderRole`, `ProviderContext`, `ProviderFactory`,
`ProviderRegistry`, `DeploymentProviderPlan`, errors/results,
`ResolvedSecret`/`SecretProvider`; coordination schema V2, stores mémoire/file;
leases de ressource partagée avec fencing; job spec/lease/completion/provider.

Les leases filesystem utilisent un lock par ressource, un fichier d'état
versionné et un sidecar versionné de high-water epoch. Le sidecar est persisté
avant la publication du lease actif et survit au release, restart et à une
acquisition interrompue ; un epoch n'est donc jamais réutilisé. L'epoch est un fencing
token seulement pour les writers qui le vérifient avant d'écrire. Un
filesystem partagé sans lock, rename, sync de répertoire ou cohérence de cache
fiables ne donne pas une protection forte contre split brain avec cet adapter
seul.

À utiliser pour composer des providers explicites. Aucun fallback silencieux ni
SDK provider-specific dans ce crate.

**Maturité :** surface composition stable; jobs distribués hors du premier
profil 1.0.
