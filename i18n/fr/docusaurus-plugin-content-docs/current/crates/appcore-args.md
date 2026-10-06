---
title: appcore-args
sidebar_position: 1
---

# appcore-args

:::info Paquet publié indépendamment
Stable **`1.0.2`** · MSRV
**Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-args/1.0.2) ·
[docs.rs](https://docs.rs/crate/appcore-args/1.0.2) ·
[code source](https://github.com/dnettoRaw/app-core-public/tree/main/crates/appcore-args)
:::

## Guide et exemples maintenus par le crate

Le dépôt public maintient le [guide détaillé](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/guide.fr.md),
l'[exemple débutant](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/examples/basic.fr.md)
et l'[exemple intermédiaire](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/examples/intermediate.fr.md).

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

## Configuration déclarative et chemins natifs

Ajouts disponibles dans `1.0.3-rc` : `OptionSpec::env`, `default_value`, `value_kind` et
`exclusive_group`. Priorité : argv, environnement déclaré, puis une valeur par
défaut. Les flags env/default acceptent seulement `true` ou `false` ; false
signifie absent. Options requises, conflits et exigences sont vérifiés après
résolution. Un groupe accepte au plus un membre ; `requires("source")` peut
exiger un membre du groupe. Env/default partagent les budgets argv. Help terminal
ne consulte pas l'environnement mais valide la spec. Erreurs env/default et
Debug des options masquent les valeurs. Help/completion ne lisent pas les valeurs.

`ValueKind::Path` accepte un chemin natif non vide et `ValueKind::SocketAddr`
un IP/port numérique, IPv6 entre crochets compris, sans DNS. `ValueType` conserve
son enum actuel. `RawArgs` reste UTF-8 ; `RawOsArgs::from_env` et
`CliParser::parse_os` préservent chemins et passthrough natifs. Texte, noms et
adresses non UTF-8 échouent. Les chemins ne sont ni canonicalisés ni vérifiés
sur disque. `option_path` retourne `PathBuf` ; `option_socket_addr` une adresse
typée. `parse_with_env` et `parse_os_with_env` permettent l'injection déterministe.

```rust
use appcore_args::{CliSpec, CliParser, OptionSpec, RawOsArgs, ValueKind};
let spec = CliSpec::new("node")
    .option(OptionSpec::value("data-dir").env("NODE_DATA_DIR")
        .default_value("./data").value_kind(ValueKind::Path))
    .option(OptionSpec::value("bind").env("NODE_BIND")
        .default_value("127.0.0.1:9000").value_kind(ValueKind::SocketAddr))
    .option(OptionSpec::value("descriptor").exclusive_group("source"))
    .option(OptionSpec::value("catalog").exclusive_group("source"))
    .option(OptionSpec::flag("serve").requires("source"));
let raw = RawOsArgs::parse([std::ffi::OsString::from("--bind=[::1]:9000")])?;
let parsed = CliParser::new(&spec).parse_os_with_env(&raw, |_| None)?;
assert!(parsed.option_path("data-dir").is_some());
assert_eq!(parsed.option_socket_addr("bind")?.unwrap().port(), 9000);
# Ok::<(), appcore_args::CliError>(())
```

## Release publiée

`1.0.3-rc` — publié sur crates.io ; les versions précédentes restent immuables.

## Paquet publié

[`appcore-args 1.0.3-rc`](https://crates.io/crates/appcore-args/1.0.3-rc) · [docs.rs](https://docs.rs/appcore-args/1.0.3-rc) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-args).
