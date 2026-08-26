---
title: AppCore Runtime
sidebar_position: 1
---

# AppCore Runtime

AppCore é um runtime Rust para aplicações cuja infraestrutura precisa ser explícita: manifests, ciclo de vida, dispatch de commands, storage, sincronização, providers, Peer RPC, gateway, supervisão e updates pertencem ao runtime, não ao boilerplate da aplicação.

Leia como um livro técnico:

1. [O que é AppCore](/introduction/what-is-appcore)
2. [Contrato de três artefatos](/architecture/three-artifact-contract)
3. [Bootstrap e runtime host](/architecture/bootstrap)
4. [Storage, DNT, backup e restore](/architecture/storage)
5. [Sync, logs, checkpoints e replay](/architecture/synchronization)
6. [Operação distribuída](/architecture/distributed)
7. [Supervisor e ciclo de vida](/architecture/supervisor)
8. [Budgets de performance](/architecture/performance-budgets)
9. [Updates](/architecture/updates)
10. [Modelo de segurança](/security/security-model)
11. [Primeira aplicação](/tutorials/first-application)
12. [Exemplos do básico ao intermediário](/tutorials/examples/)
13. [Referência dos 22 crates estáveis e da beta do appcore-ai](/crates/)
14. [Roadmap futuro](/roadmap/)

Release estável: `1.0.0`. Todos os 22 crates públicos estão disponíveis no
crates.io. Toolchain Rust mínima: `1.89`. Aplicações normalmente devem depender
de `appcore-bin@1.0.0` e usar sua facade `application`.

Beta pública de IA: `appcore-ai 0.1.0-beta.1`, publicada separadamente do grafo
estável de crates do Runtime.

## O Que Vem Depois

O roadmap futuro acompanha trabalho planejado sem misturá-lo à referência
estável do Runtime. A beta pública atual é [appcore-ai](/crates/appcore-ai), e a
prévia em design atual é [appcore-ui](/crates/appcore-ui). Áreas planejadas de
alta prioridade incluem
`appcore-test`, `appcore-jobs`, `appcore-search`, `appcore-automation` e
`appcore-plugin`; veja o [Roadmap futuro](/roadmap/).

## Limitações

Este índice é mapa de leitura, não referência completa de API. Use os capítulos para comportamento operacional, decisões e limites.
