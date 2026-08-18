---
title: appcore-update
sidebar_position: 20
---

# appcore-update

:::info Paquet publié
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-update/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-update/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-update)
:::


**Responsabilité :** sélection, authenticité, staging, activation, health gate
et rollback d'artefact opaque.

**Dépendances AppCore directes :** `appcore-contracts`, `appcore-provider`.

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
