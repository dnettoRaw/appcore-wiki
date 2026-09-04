---
title: appcore-filemaker-cli — 0.1 beta
---

# appcore-filemaker-cli

`appcore-filemaker-cli 0.1.0-beta.1` é o adapter de processo limitado do
`appcore-filemaker`. Está publicado no crates.io como prerelease beta.

O comando escolhe o formato de export; o YAML do template nunca escolhe.
`check`, `validate`, `preflight` e comandos de diagnóstico são somente leitura,
exceto por artifacts de output explícitos. `render` e `mask` publicam arquivos
atomicamente e rejeitam output que resolve para o template de input. `migrate`
é reservado e falha sem alterar input; mutação futura exige flag e contrato
explícitos. Todo comando tem output humano conciso e JSON estável para automação.
Os dois modos de stdout terminam com uma newline e param em 512 MiB. Pretty JSON
é dimensionado antes do output e serializado direto por um buffer fixo de
16 KiB, evitando uma segunda string completa.

`capabilities --json` publica a matriz estável: 0 sucesso, 2 validação, 64 uso,
65 dados, 66 input ausente, 69 indisponível, 70 software, 73 não pode criar, 74
I/O, 75 falha temporária de recurso e 130 cancelamento.

`schema --json` relata cores tipadas, a cascata executável de style, unidades de
coordenada, primitivas e comandos de path semânticos do Canvas, gráficos
avançados preparados, overrides de export somente de pintura e layer/z-index
independentes da colisão.

`debug TEMPLATE --grid 1|5|10|20 --view combined` emite o overlay completo e
não mutante. `mask` exporta geometria collision/layout/visual/combined como
PNG, PDF, SVG ou JSON estável occupied/free/collisions/overflow. `inspect` e
`explain` expõem geometria de origem, anchors, region, medição, colisão,
página/reflow e provenance preservadas pela cena resolvida.
`free-regions` consulta retângulos livres limitados. `--patch` repetível aplica
JSON de patches de runtime ordenados, e `--font-fallback` define a ordem exata
das fonts registradas. `render --format csv` exporta uma tabela vinculada sem
inventar layout gráfico para linhas de dataset.

`capabilities --json` expõe PDF editável, flattened e híbrido. Hybrid adiciona
texto Unicode invisível e subsetado sobre outlines determinísticos. WebP, XLSX,
ZPL, ESC/POS, PDF/A, links, bookmarks e acessibilidade tagged continuam preparados.
`schema --json` também declara os contratos de writer/bytes limitados, perdas
strict/best-effort, DPI somente raster, metadados PDF determinísticos e subsets
de fonts.

`check`, `validate` e `preflight` são fronteiras separadas de schema, layout
resolvido e exporter. JSON preserva warnings limitados e `truncated` explícito;
strict rejeita warnings e truncamento falha fechado. Discovery do schema também
lista validação de dados tipados, inputs completos do fingerprint e cache
imutável limitado resolve-on-miss.

Inputs de template, dados e fonts são lidos por um único handle aberto e param
em `limit + 1` bytes. Os comandos debug e mask passam os mesmos limites do core
para a geometria diagnóstica limitada.

As dependências AppCore diretas são `appcore-args` e `appcore-filemaker`.

Os comandos documentados usam os inputs concretos e separados
[`basic.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/examples/basic.yml)
e [`intermediate.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/examples/intermediate.yml),
além de dados JSON tipados no fluxo intermediário.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-cli/wiki/examples/intermediate.pt.md).
