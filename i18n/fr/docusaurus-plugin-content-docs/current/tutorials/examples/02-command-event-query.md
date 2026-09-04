---
title: 2. Enregistrement Applicatif
sidebar_position: 2
---

# 2. Enregistrement Applicatif

Implémentez `Application` lorsque le comportement métier doit être enregistré.
Le SDK collecte des registres validés sans construire l'infrastructure Runtime.

```rust title="src/main.rs"
use appcore_sdk::application::{
    CommandName, CommandRegistry, NodeId, RuntimeResult,
};
use appcore_sdk::{App, Application, AppResult};

struct ExampleApplication;

impl Application for ExampleApplication {
    fn register_commands(
        &self,
        registry: &mut CommandRegistry,
    ) -> RuntimeResult<()> {
        registry.register(CommandName::new("example.ping")?)
    }
}

fn main() -> AppResult<()> {
    let app = App::new("example-app")?;
    let prepared = app.prepare(
        &ExampleApplication,
        NodeId::new("example-local")?,
    )?;

    assert_eq!(prepared.runtime().commands().len(), 1);
    Ok(())
}
```

Utilisez les autres hooks pour événements, états, décisions, handlers, queries
et tâches. L'exécutable de déploiement consomme les contrats préparés et gère
providers, listeners, workers et shutdown.

Suite : [déclarer une tâche planifiée](./scheduled-task).
