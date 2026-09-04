---
title: appcore-sdk
sidebar_position: 28
---

# appcore-sdk

ID estável da documentação: **ACR-028**.

`appcore-sdk` é a fachada para aplicações. Ele oferece uma superfície pequena e
orientada a manifestos enquanto crates especializados continuam responsáveis
por storage, scheduling, sync, AI, documentos e deployment.

Ele substitui o `appcore-bin`, agora aposentado, sem manter o antigo host ou a
CLI do Runtime.

:::warning Migração do appcore-bin
A versão final de `appcore-bin` no crates.io é apenas um aviso de aposentadoria.
Aplicações novas devem depender diretamente de `appcore-sdk`. Aplicações
existentes mantêm seus manifests e código de negócio, trocam os imports de
`appcore_bin` e deixam providers, listeners, workers e shutdown com o
executável de deployment.
:::

Use-o para iniciar uma aplicação externa com três artefatos, implementar
`Application`, registrar comportamento ou ativar namespaces opcionais. Ele não
abre listener implicitamente, escolhe providers, resolve secrets nem controla o
processo.

Contratos principais: `run`, `App`, `Application`, `manifest` e os namespaces
opt-in. Comece pelo [tutorial da primeira aplicação](/pt/tutorials/first-application)
e pelo [guia completo do crate](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.pt.md).
Depois execute o [exemplo básico](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/basic.pt.md)
e o [exemplo intermediário](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/intermediate.pt.md).
