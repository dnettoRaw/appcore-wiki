---
title: appcore-security
sidebar_position: 10
---

# appcore-security

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-security/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-security/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-security)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-security/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-security/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-security/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** contrats réutilisables d'authentification, token, secret et
policy.

**Dépendances internes :** `appcore-core`, `appcore-dnt`.

**API principale :** provider HashToken, claims, factory/validator command
token, request hash, `SecurityError`; références, resolvers, stores, bytes
effacés, file keyring, metadata/rotation, contrat Vault, peer credentials,
adapter key provider DNT, traits authentification et policy.

À utiliser pour authentification infrastructure et indirection des secrets. Les
tokens sont signés, pas chiffrés. Ne pas placer autorisation domaine, OAuth,
TLS entrant ou vault managé ici.

`HashTokenProvider::from_secret`, `with_secret` et `with_material` retournent
un `SecurityResult` et appliquent les mêmes invariants minimaux de secret et de
salts. `compute_request_hash` produit un SHA-256 marqué `v2:` sur des champs
séparés par domaine, encadrés par leur longueur et avec présence optionnelle
explicite. Les anciens hashes sans version sont rejetés; émetteurs et
validateurs doivent être mis à jour ensemble.

La RC 1.0 ne possède aucun provider TPM ou hardware-backed. L'ADR 0005 décrit
une proposition additive 1.1 avec fallback explicite et preuves sur matériel
réel; le Runtime actuel ne revendique aucune protection matérielle.

**Maturité :** contrats RC stables; la production dépend du backend secret et
des contrôles du déploiement.
