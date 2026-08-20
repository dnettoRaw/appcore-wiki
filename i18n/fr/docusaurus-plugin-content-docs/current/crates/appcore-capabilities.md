---
title: appcore-capabilities
sidebar_position: 16
---

# appcore-capabilities

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-capabilities/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-capabilities/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-capabilities)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-capabilities/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-capabilities/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-capabilities/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** cataloguer les descripteurs composés, enregistrer les
handlers locaux et résoudre les providers locaux ou distants compatibles.

**Dépendances internes :** contracts, core et distributed contracts.

**API principale :** request/response/error, traits local handler et remote
invoker, catalogue et contexte d'enforcement, local provider, registry,
provider selection, resolution policy, selection trait/default, resolver et
invoker peer RPC fondé sur le contrat distribué.

Utiliser IDs génériques et exigences explicites. Le resolver considère health,
mode, leadership et policy; il n'interprète pas la sémantique produit.

Utilisez `CapabilityCatalog` lorsque la composition root doit résoudre et
autoriser les descripteurs du manifeste avant le dispatch. Utilisez
`CapabilityRegistry` uniquement avec un vrai handler local. Catalogue et
resolver partagent l'enforcement de request, mode d'écriture et leadership.

**Maturité :** profil de routage RC stable.
