---
title: appcore-sdk
sidebar_position: 28
---

# appcore-sdk

ID estável da documentação: **ACR-028**.

Release publicada: [`appcore-sdk 1.0.0-rc.1`](https://crates.io/crates/appcore-sdk/1.0.0-rc.1).

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

## Quando usar

- ao iniciar uma aplicação AppCore externa com os três artefatos;
- ao implementar `Application` e registrar commands, events, queries,
  decisions, states, handlers ou tasks;
- ao usar defaults locais canônicos antes de fornecer manifests V1 explícitos;
- ao ativar namespaces de capabilities sem compor manualmente um host Runtime.

Ele não abre listener implicitamente, escolhe providers, resolve secrets nem
controla o lifecycle do processo. A composição do deployment continua
explícita.

## Contratos principais

- `run` e `App` fornecem o menor contexto local validado;
- `Application` define os hooks de registro pertencentes à aplicação;
- `manifest` reexporta os contratos canônicos de manifest V1;
- namespaces protegidos por features expõem contratos de API, deployment,
  scheduler, storage, sync, AI e FileMaker;
- `App::logging` configura o pipeline limitado de `appcore-log`.

Comece pelo [tutorial da primeira aplicação](/pt/tutorials/first-application) e
pelo [guia em inglês](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.en.md),
[guia em português](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.pt.md)
ou [guia em francês](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.fr.md).
Depois execute o [exemplo básico](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/basic.pt.md)
e o [exemplo intermediário](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/intermediate.pt.md).
