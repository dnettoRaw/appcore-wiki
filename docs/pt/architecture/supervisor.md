---
title: Supervisor e ciclo de vida
sidebar_position: 7
---

# Supervisor e ciclo de vida

`appcore-supervisor` orquestra serviços dentro do processo. Ele não reinicia o processo AppCore; isso é responsabilidade de systemd, launchd, Windows Service Control Manager, container runtime ou orquestrador.

Serviços declaram nome, recurso, dependências, restart policy, activation e criticidade. O supervisor valida dependências, calcula ordem topológica, inicia em ordem e para em cooperação.

```mermaid
stateDiagram-v2
    [*] --> Stopped
    Stopped --> Starting
    Starting --> Running
    Running --> Failed
    Failed --> RestartScheduled
    RestartScheduled --> Restarting
    Restarting --> Running
    Restarting --> Orphaned
    Orphaned --> Quarantined
    Failed --> Quarantined
```

Restart não é inline: consome orçamento, aplica backoff/jitter, agenda em executor limitado e aplica completion. Fila cheia não cria trabalho sem bound. Budget esgotado vira quarantine e exige operador.

Se shutdown não consegue parar um worker, o serviço vira orphaned/quarantined. Isso é mais correto do que fingir que o worker antigo desapareceu.

Próximo: [updates](/pt/architecture/updates).

