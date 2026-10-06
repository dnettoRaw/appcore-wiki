---
title: appcore-args
sidebar_position: 1
---

# appcore-args

:::info Pacote publicado de forma independente
Estável **`1.0.2`** · MSRV
**Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-args/1.0.2) ·
[docs.rs](https://docs.rs/crate/appcore-args/1.0.2) ·
[código-fonte](https://github.com/dnettoRaw/app-core-public/tree/main/crates/appcore-args)
:::

## Guia e exemplos mantidos pelo crate

O repositório público mantém o [guia detalhado](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/guide.pt.md),
o [exemplo básico](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/examples/basic.pt.md)
e o [exemplo intermediário](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-args/wiki/examples/intermediate.pt.md).

**Responsabilidade:** especificações declarativas de CLI, ingestão limitada de
argumentos, parsing determinístico, help e completion de shell.

**Dependências AppCore diretas:** nenhuma. É um crate standalone com sua própria
linha SemVer.

**API principal:** `CliSpec`, `CommandSpec`, `OptionSpec`, `ArgumentSpec`,
`ValueType`, `RawArgs`, `HelpRenderer`, `CompletionEngine` e
`render_dynamic_completion_script`.

Toda especificação é validada antes de parsing, help ou completion. Os limites
padrão são 1.024 palavras, 64 KiB por palavra e 1 MiB no total; entrada não UTF-8
ou com NUL falha de forma fechada. Valores opcionais usam sintaxe anexada por
padrão, evitando consumir o próximo positional de forma ambígua. Valores
opcionais separados exigem opt-in explícito.

Completion dinâmica suporta Bash, Zsh, Fish e PowerShell. Sugestões são
limitadas a inputs e candidatos de 128 bytes.

**Maturidade:** fundação pública de CLI com versionamento independente.

## Configuração declarativa e paths nativos

Adições disponíveis em `1.0.3-rc`: `OptionSpec::env`, `default_value`,
`value_kind` e `exclusive_group`. Precedência: argv, ambiente declarado, depois
um valor padrão. Flags de env/default aceitam apenas `true` ou `false`; false
significa ausente. Obrigatoriedade, conflitos e requisitos são verificados após
resolução. Grupos aceitam no máximo um membro; `requires("source")` pode exigir
um membro desse grupo. Env/default compartilham budgets com argv. Help terminal
não consulta ambiente, mas valida a spec. Erros de env/default e Debug de opções
ocultam valores. Help/completion não consultam valores do ambiente.

Use `ValueKind::Path` para path nativo não vazio e `ValueKind::SocketAddr` para
IP/porta numéricos, incluindo IPv6 entre colchetes, sem DNS. `ValueType` mantém
o enum atual. `RawArgs` permanece UTF-8; `RawOsArgs::from_env` e
`CliParser::parse_os` preservam paths e passthrough nativos. Texto, nomes e
endereços não UTF-8 falham. Paths não são canonicalizados nem precisam existir.
`option_path` retorna `PathBuf`; `option_socket_addr` retorna endereço tipado.
`parse_with_env` e `parse_os_with_env` permitem injeção determinística.

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

## Release publicada

`1.0.3-rc` — publicado no crates.io; versões anteriores permanecem imutáveis.

## Pacote publicado

[`appcore-args 1.0.3-rc`](https://crates.io/crates/appcore-args/1.0.3-rc) · [docs.rs](https://docs.rs/appcore-args/1.0.3-rc) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-args).
