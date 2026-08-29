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

As dependências AppCore diretas são `appcore-ai` e `appcore-filemaker`. Policy e
orquestração de IA permanecem fora do compiler determinístico.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.pt.md).
