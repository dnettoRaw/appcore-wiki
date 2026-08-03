---
title: The Three-Artifact Contract
sidebar_position: 2
---

# The Three-Artifact Contract

The measurable goal of AppCore 1.0 is simple: a new application runs by supplying three artifacts.

1. `application.toml`
2. `deployment.toml`
3. business code implementing `appcore_bin::application::Application`

Everything else is runtime infrastructure.

## Artifact 1: Application Manifest

The Application Manifest is portable. It is written by the application author and describes what the application is, what runtime protocol it requires, which capabilities it exposes, and which runtime services it needs.

It owns:

- application identity and version;
- display name, vendor, and service ID;
- minimum runtime version and protocol version;
- functional capabilities and whether they are command/query/stream capabilities;
- idempotency and leadership requirements for capabilities;
- storage, scheduler, jobs, health, and update requirements;
- modules, feature flags, and non-sensitive metadata.

It must not contain provider IDs, machine paths, listener addresses, TLS files, tokens, passwords, private keys, or customer-specific installation values.

```toml
manifest_version = 1
application_id = "backend-template"
application_version = "0.1.0"
display_name = "AppCore Backend Template"
vendor = "Example Vendor"
service_id = "app.ping"

[runtime]
minimum_runtime_version = "1.0.0-rc.3"
protocol_version = "1"
required_features = []

[[capabilities]]
id = "app.ping"
version = "1"
mode = "command"
visibility = "local"
requires_leader = false
idempotency_required = true
```

## Artifact 2: Deployment Manifest

The Deployment Manifest is installation-owned. It describes where the unchanged application runs.

It owns:

- installation identity;
- runtime mode: standalone or cluster;
- selected providers;
- storage and backup paths;
- environment and volume bindings;
- network listener addresses and transport choices;
- secret references;
- supervisor watchdog policy.

It must not contain business rules, domain schemas, or application source code.

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

[supervisor.watchdog]
enabled = true
check_interval_ms = 1000
stall_timeout_ms = 15000
```

Secret values are referenced, not embedded. Relative paths resolve from the deployment manifest directory. Standalone mode rejects distributed coordination, discovery, leadership, and job providers. Cluster mode requires explicit compatible distributed infrastructure.

## Artifact 3: Business code

Application code implements the public `Application` trait. The runtime calls it at controlled points:

- `configure` receives validated deployment bindings;
- `register_commands` declares command names;
- `register_events`, `register_states`, and `register_decisions` expose application contracts;
- `register_handlers` connects command handlers;
- `register_queries` registers side-effect-free query endpoints;
- `register_tasks` registers bounded background task definitions.

The template shows the intended shape:

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

fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

Notice what is absent: no storage provider construction, no HTTP listener construction, no token provider wiring, no scheduler thread, no sync service, and no supervisor graph. That belongs to the host.

## The forbidden fourth artifact

An AppCore 1.0 application should not need a hand-built `RuntimeBuilder`, a private host module, an unversioned runtime config, or a forked runtime to run. Cargo metadata and the small `main` function are build integration, not architecture artifacts.

## Why this split matters

The same business code can move from local standalone mode to a cluster by changing deployment policy. That is the primary compatibility story of AppCore.

Continue with [bootstrap and runtime host](/en/architecture/bootstrap).

