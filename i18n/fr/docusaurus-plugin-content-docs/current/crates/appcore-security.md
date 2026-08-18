---
title: appcore-security
sidebar_position: 9
---

# appcore-security

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-security/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-security/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-security)
:::


**Responsabilité :** contrats réutilisables d'authentification, token, secret et
policy.

**Dépendances AppCore directes :** `appcore-core`, `appcore-dnt`.

**API principale :** provider HashToken, claims, factory/validator command
token, request hash, `SecurityError`; références, resolvers, stores, bytes
effacés, file keyring, metadata/rotation, contrat Vault, peer credentials,
adapter key provider DNT, traits authentification et policy.

À utiliser pour authentification infrastructure et indirection des secrets. Les
tokens sont signés, pas chiffrés. Ne pas placer autorisation domaine, OAuth,
TLS entrant ou vault managé ici.

La RC 1.0 ne possède aucun provider TPM ou hardware-backed. L'ADR 0005 décrit
une proposition additive 1.1 avec fallback explicite et preuves sur matériel
réel; le Runtime actuel ne revendique aucune protection matérielle.

**Maturité :** contrats RC stables; la production dépend du backend secret et
des contrôles du déploiement.
