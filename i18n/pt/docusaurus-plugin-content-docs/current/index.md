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
8. [Updates](/architecture/updates)
9. [Modelo de segurança](/security/security-model)
10. [Primeira aplicação](/tutorials/first-application)
11. [Exemplos do básico ao intermediário](/tutorials/examples/)
12. [Referência dos 21 crates publicados](/crates/)

Linha atual: `1.0.1-rc.8`. Toolchain Rust mínima: `1.89`. Os 21 crates do
Runtime estão publicados; aplicações normalmente devem depender de
`appcore-bin` e usar sua facade `application`.

## Limitations

Este índice é mapa de leitura, não referência completa de API. Use os capítulos para comportamento operacional, decisões e limites.
