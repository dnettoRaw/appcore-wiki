---
title: appcore-args
sidebar_position: 1
---

# appcore-args

:::info Paquet publié indépendamment
Publié **`1.0.1-rc.9`** · workspace actuel **`1.0.1-rc.10`** · MSRV
**Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-args/1.0.1-rc.9) ·
[docs.rs](https://docs.rs/crate/appcore-args/1.0.1-rc.9) ·
[code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-args)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-args/wiki/guide.fr.md),
l'[exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-args/wiki/examples/basic.fr.md)
et l'[exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-args/wiki/examples/intermediate.fr.md).

**Responsabilité :** spécifications CLI déclaratives, ingestion bornée des
arguments, parsing déterministe, rendu de l'aide et complétion shell.

**Dépendances AppCore directes :** aucune. C'est un crate autonome avec sa
propre ligne SemVer.

**API principale :** `CliSpec`, `CommandSpec`, `OptionSpec`, `ArgumentSpec`,
`ValueType`, `RawArgs`, `HelpRenderer`, `CompletionEngine` et
`render_dynamic_completion_script`.

Chaque spécification est validée avant parsing, aide ou complétion. Les limites
par défaut sont 1 024 mots, 64 Kio par mot et 1 Mio au total ; les entrées non
UTF-8 ou contenant NUL échouent fermées. Les valeurs optionnelles utilisent une
syntaxe attachée par défaut afin de ne pas consommer le prochain argument
positionnel de façon ambiguë. Une valeur optionnelle détachée exige un opt-in.

La complétion dynamique prend en charge Bash, Zsh, Fish et PowerShell. Les
suggestions sont bornées à des entrées et candidats de 128 octets.

**Maturité :** fondation CLI publique avec versionnement indépendant.
