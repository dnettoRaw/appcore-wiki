---
title: appcore-control-plane
sidebar_position: 15
---

# appcore-control-plane

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-control-plane/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-control-plane/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-control-plane)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-control-plane/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-control-plane/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-control-plane/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** implémentations génériques présence, heartbeat, discovery
et leases.

**Dépendances internes :** contracts, core, distributed contracts et transport.

**API principale :** clients in-memory, file et offline; configuration HTTP,
retry policy et trait transport; transports standard/bearer; coordinator et
heartbeat policy; guards leadership global/service; validation endpoint sûr.

À utiliser pour coordination distribuée sans payload métier. Le profil file
exige locks/storage certifiés. Le distant exige TLS et authentification du
déploiement.

Le profil fichier limite l'état et le backup à 16 MiB et rejette tout état
malformé ou futur. L'arithmétique d'expiration et d'epoch est vérifiée;
l'épuisement de l'epoch échoue fermé au lieu de réutiliser un fencing token.

**Maturité :** contrats et références RC stables; l'exploitation du service
externe appartient au déploiement.
