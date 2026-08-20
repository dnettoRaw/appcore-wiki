---
title: Build the First Application
sidebar_position: 11
---

# Build the First Application

The goal is not to build a product. It is to see where AppCore ends and the
application begins. The old in-repository backend template was removed; a new
application now follows the public three-artifact contract directly.

The mental model is simple: business code declares behavior, manifests declare the contract, and deployment chooses the runtime environment.

## 1. Install the published application facade

```bash
cargo add appcore-bin@1.0.1-rc.8
```

This selects the published manifest-first facade. The other public crates are
available for low-level consumers, CLI integrations, and provider adapters; see the
[crate catalog](/crates/) before depending on them directly.

## 2. What is the smallest useful business implementation?

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

## 3. Why should `main` stay small?

```rust
fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

If `main` starts HTTP servers, opens storage roots, or creates token providers, the application has crossed the runtime boundary.

## 4. Why must the manifest declare the command too?

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

## 5. What does the first deployment choose?

```toml
manifest_version = 1
installation_id = "example-local"
application_id = "example-app"
mode = "standalone"
secrets = { runtime_security = "env:APPCORE_EXAMPLE_SECRET" }
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

## 6. What should you inspect after it boots?

Set a structured local key record through the environment, then run the command
from the external application's project root. The Runtime exposes health and
status endpoints when the deployment enables a listener.

```bash
now_ms="$(($(date +%s) * 1000))"
export APPCORE_EXAMPLE_SECRET="$(printf \
  'key_id=local-%s\ncreated_at_ms=%s\nexpires_at_ms=none\nstatus=active\nsecret=hex:%s\n' \
  "$now_ms" "$now_ms" "$(openssl rand -hex 32)")"
cargo run
curl -s http://127.0.0.1:39300/v1/health
curl -s http://127.0.0.1:39300/v1/status/public
```

## What should you test next?

- manifest mismatch fails bootstrap;
- undeclared command is rejected;
- missing idempotency key is rejected for the declared command;
- storage root rejects traversal paths;
- shutdown moves lifecycle to stopped;
- enabling automatic updates without the managed supervisor path is rejected.

## Limitations

- This tutorial intentionally uses a tiny command; it does not model a full domain workflow.
- It assumes the public `appcore_bin::application` facade and the standard
  `application.toml`/`deployment.toml` paths.
- It demonstrates standalone local deployment, not a complete clustered installation.
- It does not cover custom provider authoring or production secret management.
