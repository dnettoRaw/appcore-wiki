---
title: 2. Application Registration
sidebar_position: 2
---

# 2. Application Registration

Implement `Application` when business behavior must be registered. The SDK
collects validated registries; it does not construct Runtime infrastructure.

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

Use the other `Application` hooks for events, states, decisions, handlers,
queries, and tasks. The deployment executable consumes the prepared contracts
and owns providers, listeners, workers, and shutdown.

Next: [declare a scheduled task](./scheduled-task).
