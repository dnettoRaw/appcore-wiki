---
title: appcore-core
sidebar_position: 8
---

# appcore-core

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-core/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-core/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-core)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-core/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** lifecycle, enregistrement, dispatch, state, audit et
idempotence génériques dans le processus.

**Dépendances internes :** `appcore-contracts`, `appcore-types`.

**API principale :** `RuntimeBuilder`, `RuntimeController`, `RuntimeInstance`,
`RuntimeLifecycle`, registries et buses command/event, enveloppes,
`CommandHandler`, `CommandResult`, `RuntimeContext`, audit log/journal,
idempotence mémoire/fichier, state et decision engines, clock, redaction et
`AppPlugin` de compatibilité.

Sur la ligne de maintenance 1.0 actuelle, les clones de `RuntimeController`
partagent lifecycle, idempotence et état inflight, tandis que le command bus
immuable possède les handlers via `Arc`. Les handlers indépendants s'exécutent
en parallèle ; une même clé idempotente n'admet toujours qu'une exécution. Le
shutdown ferme l'admission atomiquement avant le drainage borné des commandes
admises.

L'`AuditLog` local au processus borne ses snapshots de commandes et d'entrées
génériques à 10 000 éléments et à un budget partagé par défaut de 16 Mio.
`with_max_bytes` peut réduire le budget ; `stats` expose les octets courants/de
pic, évictions et rejets ; `write_jsonl` transmet un snapshot copy-on-write
partagé après libération du lock d'état. L'adaptateur compatible `export_jsonl`
retourne intentionnellement une String owned.

Utilisez `entries_snapshot` pour obtenir un tableau JSON structuré. La vue
immuable implémente `Serialize`, partage le stockage retenu au lieu de le cloner
en profondeur et reste stable après des mutations ultérieures. La fixture
pretty-JSON mesurée contenait 10 000 entrées et 2 996 676 octets, avec 1,12 ms
p50 et 6,42 Mio de RSS de pic sur Apple M1.

`records_snapshot` fournit la vue correspondante des enregistrements command.
Les deux types de snapshot exposent `recent(limit)` afin que le caller emprunte
seulement la page la plus récente après libération du lock. Une sélection de
1 000 sur 10 000 a mesuré 2,06 us p50 et 11,88 Mio de RSS de pic, contre 4,16 ms
et 20,33 Mio pour les copies owned complètes.

Les nouvelles applications utilisent les re-exports de
`appcore_bin::application`; elles n'assemblent pas le core. Garder I/O adapters
et comportement domaine hors de ce crate.

**Maturité :** surface low-level stable; builder/plugin restent de
compatibilité, manifest-first est préféré.
