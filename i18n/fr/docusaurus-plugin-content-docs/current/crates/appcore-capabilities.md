---
title: appcore-capabilities
sidebar_position: 15
---

# appcore-capabilities

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-capabilities/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-capabilities/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-capabilities)
:::


**Responsabilité :** enregistrer les handlers locaux et résoudre providers
locaux ou distants compatibles.

**Dépendances AppCore directes :** `appcore-contracts`, `appcore-core`, `appcore-distributed-contracts`.

**API principale :** request/response/error, traits local handler et remote
invoker, local provider, registry, provider selection, resolution policy,
selection trait/default, resolver et invoker peer RPC.

Utiliser IDs génériques et exigences explicites. Le resolver considère health,
mode, leadership et policy; il n'interprète pas la sémantique produit.

**Maturité :** profil de routage RC stable.
