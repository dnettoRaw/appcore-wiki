---
title: 1. Standalone Ping
sidebar_position: 1
---

# 1. Standalone Ping

This smallest complete application registers `app.ping`, starts the
manifest-first host, and exposes versioned health/status routes.

## Project layout

```text
appcore-example/
├── Cargo.toml
├── application.toml
├── deployment.toml
└── src/
    └── main.rs
```

## Cargo dependency

```toml title="Cargo.toml"
[package]
name = "appcore-example"
version = "0.1.0"
edition = "2021"
rust-version = "1.89"

[dependencies]
appcore-bin = { version = "=1.0.0", default-features = false }
```

The exact pin keeps the tutorial reproducible against the stable 1.0 contract.

## Application Manifest

```toml title="application.toml"
manifest_version = 1
application_id = "appcore-example"
application_version = "0.1.0"
display_name = "AppCore Example"
vendor = "Example"
service_id = "app.ping"
leadership = []
dependencies = []
modules = []
feature_flags = {}
metadata = {}

[runtime]
minimum_runtime_version = "1.0.0"
protocol_version = "1"
required_features = []

[[capabilities]]
id = "app.ping"
version = "1"
mode = "command"
visibility = "local"
requires_leader = false
idempotency_required = true

[jobs]
enabled = false
max_concurrency = 0
retry_limit = 0

[storage]
durability = "local"
minimum_bytes = 0
shared = false

[scheduler]
required = false
max_concurrency = 0

[health]
startup_grace_ms = 30000
heartbeat_interval_ms = 10000
failure_threshold = 3

[update]
channel = "stable"
automatic = false
```

The command is declared twice for different reasons: the manifest publishes
the portable contract; Rust code registers its implementation.

## Deployment Manifest

```toml title="deployment.toml"
manifest_version = 1
installation_id = "appcore-example-local"
application_id = "appcore-example"
mode = "standalone"
secrets = { runtime_security = "env:APPCORE_EXAMPLE_SECRET" }
paths = { storage = "target/runtime/storage", backup = "target/runtime/backups" }
volumes = []
adapters = {}
environment = {}

[supervisor.watchdog]
enabled = true
check_interval_ms = 1000
stall_timeout_ms = 15000

[storage]
provider_id = "file"
settings = {}
secret_refs = {}

[network]
listen_addresses = ["127.0.0.1:39300"]
peer_transport = "http"
command_transport = "http"

[network.tls]
enabled = false
```

Loopback without TLS is for local development only.

## Business code

```rust title="src/main.rs"
use appcore_bin::application::{
    Application, CommandBus, CommandEnvelope, CommandHandler, CommandName,
    CommandRegistry, CommandResult, RuntimeContext, RuntimeResult,
};

struct PingApplication;

impl Application for PingApplication {
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

fn main() {
    if let Err(error) =
        appcore_bin::application::run_application(&PingApplication)
    {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

## Generate a local structured secret

Raw secrets are rejected by the current update wall. Generate structured,
random material for this shell session:

```bash
now_ms="$(($(date +%s) * 1000))"
export APPCORE_EXAMPLE_SECRET="$(printf \
  'key_id=local-%s\ncreated_at_ms=%s\nexpires_at_ms=none\nstatus=active\nsecret=hex:%s\n' \
  "$now_ms" "$now_ms" "$(openssl rand -hex 32)")"
```

Do not commit or print this value.

## Run and inspect

```bash
APPCORE_APPLICATION_MANIFEST=application.toml \
APPCORE_DEPLOYMENT_MANIFEST=deployment.toml \
cargo run
```

From another terminal:

```bash
curl -s http://127.0.0.1:39300/v1/health
curl -s http://127.0.0.1:39300/v1/status/public
```

`/health` and `/status` are removed interfaces and return the update-wall
response. Use only `/v1/*` routes.

## Expected failures to try

- Remove the idempotency key from a real `app.ping` command request.
- Change one manifest's `application_id` so the identities disagree.
- Remove `APPCORE_EXAMPLE_SECRET`.
- Replace the structured secret with a raw random string.

All four cases must fail before uncontrolled business execution.

Next: [emit an event and add a query](./command-event-query).
