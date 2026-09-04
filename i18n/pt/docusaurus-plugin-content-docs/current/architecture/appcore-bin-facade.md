---
title: Ownership da fachada SDK
sidebar_position: 13
---

# Ownership da fachada SDK

A decisão AC-023 anterior, que mantinha aplicação e host juntos em
`appcore-bin`, foi substituída.

## Decisão atual

`appcore-sdk` possui a fachada pública da aplicação, manifests locais
canônicos, bridge de registros, logging limitado e namespaces opcionais de
capabilities. `appcore-bin` foi aposentado e removido do workspace do Runtime.

O SDK não possui host ou CLI implícito do Runtime. Executáveis de deployment
controlam providers, listeners, workers, sinais e shutdown. Assim, o código de
negócio permanece no [contrato de três artefatos](./three-artifact-contract)
sem transformar o SDK em composition root de processo.

Nenhum alias de compatibilidade ou segundo parser preserva `appcore_bin`.
Aplicações existentes migram diretamente para
[`appcore-sdk`](/pt/crates/appcore-sdk).
