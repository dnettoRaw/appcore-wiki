---
title: appcore-args
sidebar_position: 1
---

# appcore-args

:::info Pacote publicado de forma independente
Estável **`1.0.1`** · MSRV
**Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-args/1.0.1) ·
[docs.rs](https://docs.rs/crate/appcore-args/1.0.1) ·
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
