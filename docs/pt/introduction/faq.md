---
title: FAQ
sidebar_position: 5
---

# FAQ

## Introdução

Esta página responde diretamente perguntas de encaixe e escopo para que leitores não tratem AppCore como mais ou menos do que ele é.

## Perguntas

### Is AppCore a web framework?

Não. Ele tem endpoints HTTP de command/query/status, mas o runtime também controla manifests, ciclo de vida, contratos de storage, segurança, scheduling, sync, Peer RPC, coordenação de control plane, supervisão e updates.

### What is the recommended application entry point?

Novas aplicações implementam `appcore_bin::application::Application` e chamam `run_application`.

### What are the three artifacts?

`application.toml`, `deployment.toml` e código de negócio. O primeiro é portável e escrito pela aplicação. O segundo pertence à instalação e seleciona providers. O código de negócio recebe contexto validado do runtime em vez de montar infraestrutura manualmente.

### What should not be placed in manifests?

Secrets, chaves privadas, valores locais exclusivos do operador, payloads de negócio e schemas de domínio.

### Does AppCore provide consensus?

Não. Sync é replicação conservadora leader-to-follower; operação distribuída usa leases, fencing, descoberta via control plane e Peer RPC. Consenso multi-master está fora do escopo.

## Páginas relacionadas

- [Status do projeto](/pt/introduction/project-status)
- [Manifest Concept](/pt/concepts/manifests)
- [Provider Model](/pt/concepts/providers)
