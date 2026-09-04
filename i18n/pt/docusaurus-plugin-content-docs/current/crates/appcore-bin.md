---
title: appcore-bin (aposentado)
sidebar_position: 22
---

# appcore-bin foi aposentado

:::danger Não use em aplicações novas
`appcore-bin` foi removido do workspace do Runtime. Seu pacote final no
crates.io, [`1.0.1`](https://crates.io/crates/appcore-bin/1.0.1), é um aviso de
aposentadoria sem dependências e não oferece executável, host, CLI, camada de
compatibilidade ou comportamento do Runtime. Todas as versões funcionais
anteriores estão yanked.
:::

Use [`appcore-sdk 1.0.0-rc.1`](https://crates.io/crates/appcore-sdk/1.0.0-rc.1)
para contratos da aplicação, manifests canônicos, registros, logging e
namespaces opcionais de capabilities.

Aplicações existentes mantêm `application.toml`, `deployment.toml` e o código
de negócio. Troque imports de `appcore_bin` por `appcore_sdk`; o executável de
deployment continua responsável por providers, listeners, workers, sinais e
shutdown.

Releases históricas de `appcore-bin` permanecem apenas como evidência no
registro. Elas não são a API atual de aplicações AppCore.
