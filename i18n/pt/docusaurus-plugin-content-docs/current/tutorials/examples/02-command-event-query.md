---
title: 2. Registro da Aplicação
sidebar_position: 2
---

# 2. Registro da Aplicação

Implemente `Application` quando o comportamento de negócio precisar ser
registrado. O SDK coleta registries validados sem construir infraestrutura.

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

Use os outros hooks para eventos, estados, decisões, handlers, queries e
tarefas. O executável de deployment consome os contratos preparados e controla
providers, listeners, workers e shutdown.

Próximo: [declare uma tarefa agendada](./scheduled-task).
