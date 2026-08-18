---
title: Exemplos — do básico ao intermediário
sidebar_position: 0
slug: /pt/tutorials/examples/
---

# Exemplos — do básico ao intermediário

Esta trilha evolui uma única aplicação externa sem atravessar a fronteira do
AppCore. Cada etapa mantém os três artefatos próprios da aplicação: Application
Manifest, Deployment Manifest e código de negócio. A infraestrutura continua
dentro de `appcore-bin`.

| Nível | Exemplo | Aprendizado principal |
| --- | --- | --- |
| 1 — Básico | [Ping standalone](./standalone-ping) | Instalar pelo crates.io, declarar um command e iniciar com segurança |
| 2 — Básico+ | [Command, event e query](./command-event-query) | Aplicar o manifest, emitir um fato, adicionar leitura sem side effects e testar os dois caminhos |
| 3 — Intermediário | [Task agendada](./scheduled-task) | Registrar trabalho limitado enquanto o Runtime controla workers e shutdown |
| 4 — Intermediário | [De standalone para cluster](./standalone-to-cluster) | Manter o código de negócio e trocar infraestrutura pelo deployment |

## Antes de começar

- Instale Rust `1.89` ou mais recente.
- Use AppCore `1.0.1-rc.8`.
- Mantenha secrets fora dos manifests.
- Execute cada exemplo a partir da raiz do projeto.

Os exemplos usam a facade pública `appcore_bin::application`. Eles não copiam
`RuntimeBuilder`, não montam listener HTTP manualmente e não instanciam
providers de storage ou security no código da aplicação.

## O que estes exemplos não prometem

File provider local, HTTP em loopback e coordenação file-backed são perfis de
aprendizado e conformidade. Um deployment de produção ainda é responsável por
TLS, gestão de secrets, garantias do filesystem, backup, capacidade e evidência
dos providers operados.
