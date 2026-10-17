---
title: appcore-sdk — RC
sidebar_position: 28
---

# appcore-sdk

:::info Release candidate
Candidata **`1.0.2-rc.3`**, a aguardar qualificação final e publicação no registry. Selecionar o pacote exato apenas após verificação.
:::

ID estável da documentação: **ACR-028**.

Release publicada: [`appcore-sdk 1.0.2-rc`](https://crates.io/crates/appcore-sdk/1.0.2-rc).

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

## Prerelease independente — 2026-10-14

`1.0.2-rc.1`: alterações próprias.

[crates.io](https://crates.io/crates/appcore-sdk/1.0.2-rc.1) · [docs.rs](https://docs.rs/appcore-sdk/1.0.2-rc.1)

## 1.0.2-rc.3

Os pins exatos selecionam a distribuição de segurança da IA e a RC FileMaker qualificadas quando aplicável. APIs públicas, features padrão e entradas V1 mantêm-se. Selecionar a release exata e atualizar explicitamente o lockfile completo; os pins antigos permanecem imutáveis. O backend opcional usa as distribuições de segurança do registry documentadas na página AI. Isto não certifica hardware nem migra aplicações externas.
