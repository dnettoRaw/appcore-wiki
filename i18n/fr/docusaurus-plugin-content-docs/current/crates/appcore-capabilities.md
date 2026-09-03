---
title: appcore-capabilities
sidebar_position: 16
---

# appcore-capabilities

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-capabilities/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-capabilities/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-capabilities)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

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

Le resolver par défaut parcourt des références empruntées de peer et de
descriptor, ne conserve que le premier fallback compatible et clone uniquement
le provider retenu. La compatibilité utilise le descriptor déjà trouvé au lieu
de parcourir une copie de tous les noms annoncés. Une
`CapabilitySelectionPolicy`
personnalisée continue de recevoir le slice owned complet exigé par le trait
public stable.

Utilisez `CapabilityResolver::handle_owned` lorsque le caller ne doit plus
conserver la request. La policy et les handlers locaux restent borrowed, mais
l'adapter Peer RPC transfère l'ID, la capability, le payload, la clé
d'idempotence et la trace directement dans son DTO sortant. Les callers et
invokers personnalisés qui utilisent le contrat emprunté restent compatibles.

**Maturité :** profil de routage stable.
