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

`schema --json` relata cores tipadas, a cascata executável de style, unidades de
coordenada, primitivas e comandos de path semânticos do Canvas, gráficos
avançados preparados, overrides de export somente de pintura e layer/z-index
independentes da colisão.

`debug TEMPLATE --grid 1|5|10|20 --view combined` emite o overlay completo e
não mutante. `mask` exporta geometria collision/layout/visual/combined como
PNG, PDF, SVG ou JSON estável occupied/free/collisions/overflow. `inspect` e
`explain` expõem geometria de origem, anchors, region, medição, colisão,
página/reflow e provenance preservadas pela cena resolvida.

As dependências AppCore diretas são `appcore-args` e `appcore-filemaker`.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/intermediate.pt.md).
