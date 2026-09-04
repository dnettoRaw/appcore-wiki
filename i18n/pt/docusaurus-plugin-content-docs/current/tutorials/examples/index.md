---
title: Exemplos — Básico ao Intermediário
sidebar_position: 0
slug: /tutorials/examples/
---

# Exemplos — Básico ao Intermediário

Estes exemplos evoluem uma aplicação externa pela fachada atual
`appcore-sdk`. Cada etapa mantém os três artefatos próprios: Application
Manifest, Deployment Manifest e código de negócio.

| Nível | Exemplo | Ideia principal |
| --- | --- | --- |
| 1 | [Menor aplicação local](./standalone-ping) | Validar manifests locais canônicos e logging |
| 2 | [Registro da aplicação](./command-event-query) | Registrar contratos sem construir infraestrutura |
| 3 | [Contrato de tarefa agendada](./scheduled-task) | Declarar trabalho limitado para o scheduler do deployment |
| 4 | [Standalone para cluster](./standalone-to-cluster) | Manter o negócio enquanto a política de deployment muda |

Comece com `appcore-sdk = "1.0.0-rc.1"` e ative somente as features usadas.
Nenhum exemplo cria host implícito ou CLI do Runtime.
