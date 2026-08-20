---
title: appcore-update
sidebar_position: 21
---

# appcore-update

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-update/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-update/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-update)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-update/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-update/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-update/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** sélection, authenticité, staging, activation, health gate
et rollback d'artefact opaque.

**Dépendances internes :** contracts et provider.

**API principale :** artifact descriptor/signing payload; verifier,
unsigned-local protégé par feature/Ed25519, trust policy/key status; update request/provider et file
factory; staged artifact, activation receipt/store; coordinator,
preparation/outcome, health check et fault injection.

À utiliser pour binaires ou artefacts opaques. Le Runtime valide identité,
version, protocole, checksum et trust sans comprendre code ou schéma.

Les lectures fichier sont bornées et rejettent un composant final non régulier.
L'activation revalide taille et SHA-256 du staged, puis crée un hard link vers
un path de build immuable. Un path existant n'est réutilisé que si ses octets
correspondent exactement au descriptor; il n'est jamais remplacé. Le no-follow
atomique du composant final existe sous Unix. Les autres plateformes conservent
les checks metadata mais dépendent de la frontière filesystem du déploiement
contre les races de reparse.

**Maturité :** lifecycle RC stable; supply chain distant exige signature,
provenance et trust roots.
