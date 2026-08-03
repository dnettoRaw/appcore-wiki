---
title: Build the First Application
sidebar_position: 11
---

# Build the First Application

This tutorial follows the maintained backend template shape. The goal is not to build a product. The goal is to see where AppCore ends and the application begins.

## 1. Create the business implementation

The smallest useful application declares a command and registers a handler:

```rust
use appcore_bin::application::{
    Application, CommandBus, CommandEnvelope, CommandHandler, CommandName,
    CommandRegistry, CommandResult, RuntimeContext, RuntimeResult,
};

struct BackendApplication;

impl Application for BackendApplication {
    fn register_commands(&self, registry: &mut CommandRegistry) -> RuntimeResult<()> {
        registry.register(CommandName::new("app.ping")?)
    }

    fn register_handlers(&self, bus: &mut CommandBus) -> RuntimeResult<()> {
        bus.register_handler(PingHandler)
    }
}

struct PingHandler;

impl CommandHandler for PingHandler {
    fn command_name(&self) -> CommandName {
        CommandName::new("app.ping").expect("static command name")
    }

    fn handle(
        &self,
        _command: &CommandEnvelope,
        _context: &dyn RuntimeContext,
    ) -> RuntimeResult<CommandResult> {
        Ok(CommandResult::accepted(Vec::new()))
    }
}
```

## 2. Keep `main` small

```rust
fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

If `main` starts HTTP servers, opens storage roots, or creates token providers, the application has crossed the runtime boundary.

## 3. Declare the command in the Application Manifest

```toml
[[capabilities]]
id = "app.ping"
version = "1"
mode = "command"
visibility = "local"
requires_leader = false
idempotency_required = true
```

Because idempotency is required, a command request without an idempotency key is rejected before handler execution.

## 4. Select local deployment policy

```toml
manifest_version = 1
installation_id = "backend-template-local"
application_id = "backend-template"
mode = "standalone"
secrets = { runtime_security = "env:APPCORE_BACKEND_TEMPLATE_SECRET" }
paths = { storage = "target/runtime/storage", backup = "target/runtime/backups" }

[storage]
provider_id = "file"
settings = {}
secret_refs = {}

[network]
listen_addresses = ["127.0.0.1:39300"]
peer_transport = "http"
command_transport = "http"
```

The deployment selects the file storage provider and listener address. The application code does not change if a later deployment selects cluster mode and a different provider set.

## 5. Run and inspect

Set a local secret through the environment, then run the application. The runtime exposes health and status endpoints when the deployment enables a listener.

```bash
export APPCORE_BACKEND_TEMPLATE_SECRET="$(openssl rand -hex 32)"
cargo run --manifest-path templates/appcore-backend/Cargo.toml
curl -s http://127.0.0.1:39300/health
curl -s http://127.0.0.1:39300/status
```

## What to test next

- manifest mismatch fails bootstrap;
- undeclared command is rejected;
- missing idempotency key is rejected for the declared command;
- storage root rejects traversal paths;
- shutdown moves lifecycle to stopped;
- enabling automatic updates without the managed supervisor path is rejected.

