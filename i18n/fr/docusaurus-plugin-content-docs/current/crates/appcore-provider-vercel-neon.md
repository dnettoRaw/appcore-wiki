---
title: appcore-provider-vercel-neon
sidebar_position: 20
---

# appcore-provider-vercel-neon

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider-vercel-neon/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-provider-vercel-neon/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-provider-vercel-neon)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-provider-vercel-neon/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-provider-vercel-neon/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-provider-vercel-neon/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** factory officielle isolée de l'adapter API Vercel avec
coordination Neon opérée extérieurement.

**Dépendances internes :** contracts, control plane et provider.

**API principale :** `VERCEL_NEON_PROVIDER_ID`, `AUTH_TOKEN_SECRET`, type
partagé du client et `VercelNeonControlPlaneFactory`.

Les nodes reçoivent seulement endpoint Vercel et référence auth token. Les
credentials, schémas, backup et retention Neon restent dans le service externe.

**Maturité :** adapter RC supporté; certification incluant le backend séparé.
