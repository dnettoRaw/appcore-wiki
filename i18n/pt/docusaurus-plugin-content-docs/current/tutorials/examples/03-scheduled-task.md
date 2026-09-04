---
title: 3. Contrato de Tarefa Agendada
sidebar_position: 3
---

# 3. Contrato de Tarefa Agendada

Ative `scheduler` apenas quando a aplicação registrar trabalho local limitado:

```toml title="Cargo.toml"
[dependencies]
appcore-sdk = { version = "1.0.0-rc.1", features = ["scheduler"] }
```

Implemente `Application::register_tasks` com `ApplicationTaskRegistry`,
`ScheduledTask`, `TaskSchedule` e política explícita de retry. O callback faz
uma unidade limitada de trabalho e retorna resultado controlado.

A aplicação possui o callback e a identidade da tarefa. O deployment possui
workers, concorrência, retry, cancelamento, supervisão e shutdown. Nunca inicie
thread destacada ou loop infinito no callback.

Teste IDs duplicados, intervalos zero, idempotência de retry, admissão durante
shutdown e falhas do callback. Workflows duráveis continuam fora do scheduler
local do processo.

Próximo: [mude o deployment sem mudar o negócio](./standalone-to-cluster).
