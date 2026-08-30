---
title: appcore-filemaker-ai — 0.1 alpha
---

# appcore-filemaker-ai

`appcore-filemaker-ai 0.1.0-alpha.1` é o bridge opcional e limitado entre tools
do `appcore-ai` e sessões FileMaker determinísticas. É uma prévia no código e
não foi publicado no crates.io.

O bridge declara 20 tools exatas com schemas fechados iguais à execução, aplica
limites de chamadas, argumentos, patches limitados também pelo core e bytes de
resultado, e verifica a policy editable/locked do template em subtrees
destrutivas antes de mutações atômicas. Documentos candidatos validam e modelos
gráficos resolvem antes do commit; sequências de patch são a próxima revision. Consultas não
alteram revision. Tools de artifact retornam base64 limitado em memória e nunca
escolhem um path no filesystem.
`filemaker_export` também seleciona uma tabela de dataset vinculada e retorna
CSV limitado; sessões de dataset nunca fabricam uma página gráfica. O loop
recomendado testado executa create, patch, inspect, validate, preview, debug
mask e export.

Capabilities fornecem chamadas restantes e contexto compacto de purpose/rules
e IDs editable/locked. Substituir um documento confiável também substituiria
essa policy do autor, portanto `load` exige opt-in explícito do host via
`allow_document_replacement`, falso por default. Loads e patches que falham
preservam estado e revision.

`filemaker_schema` relata cores tipadas, cada layer da cascata, unidades e
primitivas semânticas do Canvas, ordem de pintura, fronteiras dos resolvers e
gráficos avançados preparados. `filemaker_add` aceita um elemento de origem
estrito e compacto identificado por `type`, ou uma IR completa identificada por
`kind`; campos que exigem expansão do compiler ou binding falham explicitamente.
`filemaker_set` e patches tipados aceitam `set_style` transacional; overrides de
export permanecem somente pintura e não alteram layout.

Inspeção aceita um ID de elemento ou uma página e retorna o trace estruturado
de geometria/reflow preservado. O input de debug mask declara explicitamente
página e view collision/layout/visual/combined, enquanto free regions declara
suas dimensões mínimas; esses argumentos aceitos não ficam mais ocultos por
schemas vazios.

A descoberta de capabilities separa exporters implementados de WebP, XLSX,
ZPL, ESC/POS, PDF/A, PDF Hybrid, links, bookmarks e acessibilidade tagged
preparados. Seu contrato de export nomeia writers do chamador ou bytes
limitados, loss reports strict/best-effort, DPI somente raster, metadados PDF
determinísticos e subsets de fonts no PDF editável, impedindo o modelo de
inferir um output indisponível.

`filemaker_validate` retorna issues de layout limitadas e truncamento explícito.
`filemaker_preflight` declara seus inputs reais de formato, fidelity, modo,
página, DPI, strict e acessibilidade. Discovery do schema nomeia as quatro
etapas de validação, inputs completos do fingerprint e cache imutável
resolve-on-miss.

As tools de debug-mask e regiões livres passam os limites do core da sessão
para a geometria diagnóstica limitada, impedindo o bridge opcional de contornar
budgets de comparações ou geometria retida.

As dependências AppCore diretas são `appcore-ai` e `appcore-filemaker`. Policy e
orquestração de IA permanecem fora do compiler determinístico.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.pt.md).
