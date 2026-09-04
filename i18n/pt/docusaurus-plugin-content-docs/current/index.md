---
title: AppCore Runtime
sidebar_position: 1
---

# AppCore Runtime

AppCore é um runtime Rust para aplicações cuja infraestrutura precisa ser explícita: manifests, ciclo de vida, dispatch de commands, storage, sincronização, providers, Peer RPC, gateway, supervisão e updates pertencem ao runtime, não ao boilerplate da aplicação.

Leia como um livro técnico:

1. [O que é AppCore](/pt/introduction/what-is-appcore)
2. [Contrato de três artefatos](/pt/architecture/three-artifact-contract)
3. [Bootstrap e runtime host](/pt/architecture/bootstrap)
4. [Storage, DNT, backup e restore](/pt/architecture/storage)
5. [Sync, logs, checkpoints e replay](/pt/architecture/synchronization)
6. [Operação distribuída](/pt/architecture/distributed)
7. [Supervisor e ciclo de vida](/pt/architecture/supervisor)
8. [Budgets de performance](/pt/architecture/performance-budgets)
9. [Updates](/pt/architecture/updates)
10. [Modelo de segurança](/pt/security/security-model)
11. [Primeira aplicação](/pt/tutorials/first-application)
12. [Exemplos do básico ao intermediário](/pt/tutorials/examples/)
13. [Referência dos crates estáveis e das prévias publicadas](/pt/crates/)
14. [Roadmap futuro](/pt/roadmap/)

Release estável: `1.0.0`. O catálogo atual do código-fonte contém 28 crates
públicos ativos, com versões independentes e maturidade explícita. Toolchain
Rust mínima: `1.89`. Código de aplicação novo começa por
[`appcore-sdk`](/pt/crates/appcore-sdk); crates de nível inferior continuam
disponíveis quando seu contrato precisa ser usado diretamente. Consulte a
página de cada crate antes de assumir que uma prerelease do código-fonte foi
publicada.

O V1 estável é uma promessa de compatibilidade, não um congelamento de
funcionalidades do repositório inteiro. O AppCore pode continuar adicionando
capacidades genéricas de Runtime e crates versionados independentemente,
mantendo os contratos V1 coerentes; contratos incompatíveis exigem uma nova
versão explícita.

## O Que Vem Depois

O roadmap futuro acompanha trabalho planejado sem misturá-lo à referência
atual do Runtime. O trabalho em prerelease inclui
[appcore-ai](/pt/crates/appcore-ai),
[appcore-filemaker](/pt/crates/appcore-filemaker) e
[appcore-sync-sqlite](/pt/crates/appcore-sync-sqlite); a prévia em design atual
é [appcore-ui](/pt/crates/appcore-ui). Áreas planejadas de
alta prioridade incluem
`appcore-test`, `appcore-jobs`, `appcore-search`, `appcore-automation` e
`appcore-plugin`; veja o [Roadmap futuro](/pt/roadmap/).

## Limitações

Este índice é mapa de leitura, não referência completa de API. Use os capítulos para comportamento operacional, decisões e limites.
