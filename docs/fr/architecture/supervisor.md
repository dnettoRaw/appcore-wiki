---
title: Supervisor et cycle de vie
sidebar_position: 7
---

# Supervisor et cycle de vie

`appcore-supervisor` orchestre des services dans le processus. Il ne redémarre pas le processus AppCore ; systemd, launchd, Windows Service Control Manager, container runtime ou orchestrateur restent propriétaires du processus.

Les services déclarent nom, resource, dépendances, restart policy, activation et criticité. Le supervisor valide les dépendances, calcule l'ordre topologique, démarre dans l'ordre et stoppe coopérativement.

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

Restart est planifié : budget, backoff/jitter, executor borné, completion. Budget épuisé mène à quarantine et action opérateur. Un worker non stoppable devient orphaned/quarantined au lieu d'être ignoré.

Suivant : [updates](/fr/architecture/updates).

