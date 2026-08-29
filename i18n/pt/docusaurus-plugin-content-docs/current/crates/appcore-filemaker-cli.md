---
title: appcore-filemaker-cli — 0.1 alpha
---

# appcore-filemaker-cli

`appcore-filemaker-cli 0.1.0-alpha.1` é o adapter de processo limitado do
`appcore-filemaker`. É uma prévia no código e não foi publicado no crates.io.

O comando escolhe o formato de export; o YAML do template nunca escolhe.
`check`, `validate`, `preflight` e comandos de diagnóstico são somente leitura,
exceto por artifacts de output explícitos. `render` e `mask` publicam arquivos
atomicamente. `migrate` é reservado e falha sem alterar input. Respostas JSON
estáveis servem à automação e falhas tipadas preservam exit codes não zero.

`schema --json` relata cores tipadas, a cascata executável de style, overrides
de export somente de pintura e layer/z-index independentes da colisão.

As dependências AppCore diretas são `appcore-args` e `appcore-filemaker`.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/intermediate.pt.md).
