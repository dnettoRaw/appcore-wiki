---
title: appcore-filemaker-ai — 0.1 alpha
---

# appcore-filemaker-ai

`appcore-filemaker-ai 0.1.0-alpha.1` é o bridge opcional e limitado entre tools
do `appcore-ai` e sessões FileMaker determinísticas. É uma prévia no código e
não foi publicado no crates.io.

O bridge declara 20 tools exatas, aplica limites de chamadas, patches e bytes
de resultado e verifica a policy editable/locked do template antes de mutações
atômicas. Consultas não alteram revision. Tools de artifact retornam base64
limitado em memória e nunca escolhem um path no filesystem.

`filemaker_schema` relata cores tipadas, cada layer da cascata, unidades e
primitivas semânticas do Canvas, ordem de pintura, fronteiras dos resolvers e
gráficos avançados preparados. `filemaker_add` aceita um elemento de origem
estrito e compacto identificado por `type`, ou uma IR completa identificada por
`kind`; campos que exigem expansão do compiler ou binding falham explicitamente.
`filemaker_set` e patches tipados aceitam `set_style` transacional; overrides de
export permanecem somente pintura e não alteram layout.

As dependências AppCore diretas são `appcore-ai` e `appcore-filemaker`. Policy e
orquestração de IA permanecem fora do compiler determinístico.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.pt.md).
