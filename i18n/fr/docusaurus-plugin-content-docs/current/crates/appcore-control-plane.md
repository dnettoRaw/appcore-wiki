---
title: appcore-control-plane
sidebar_position: 14
---

# appcore-control-plane

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-control-plane/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-control-plane/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-control-plane)
:::


**Responsabilité :** implémentations génériques présence, heartbeat, discovery
et leases.

**Dépendances AppCore directes :** `appcore-contracts`, `appcore-core`, `appcore-distributed-contracts`, `appcore-transport`.

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
