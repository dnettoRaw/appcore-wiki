---
title: 3. Contrat de Tâche Planifiée
sidebar_position: 3
---

# 3. Contrat de Tâche Planifiée

Activez `scheduler` uniquement si l'application enregistre un travail local
borné :

```toml title="Cargo.toml"
[dependencies]
appcore-sdk = { version = "1.0.0-rc.1", features = ["scheduler"] }
```

Implémentez `Application::register_tasks` avec `ApplicationTaskRegistry`,
`ScheduledTask`, `TaskSchedule` et une politique de retry explicite. Le callback
effectue une unité de travail bornée et retourne un résultat contrôlé.

L'application possède le callback et l'identité de tâche. Le déploiement
possède workers, concurrence, retry, annulation, supervision et shutdown. Ne
démarrez jamais un thread détaché ou une boucle infinie dans le callback.

Testez les identités dupliquées, intervalles nuls, retry idempotent, admission
pendant le shutdown et échecs du callback. Les workflows durables restent hors
du scheduler local au processus.

Suite : [changer le déploiement sans changer le métier](./standalone-to-cluster).
