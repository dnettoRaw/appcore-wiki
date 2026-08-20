---
title: 1. Ping standalone
sidebar_position: 1
---

# 1. Ping standalone

Cette application minimale complète enregistre `app.ping`, démarre le host
manifest-first et expose les routes versionnées de health et status.

## Structure du projet

```text
appcore-example/
├── Cargo.toml
├── application.toml
├── deployment.toml
└── src/
    └── main.rs
```

## Dépendance Cargo

```toml title="Cargo.toml"
[package]
name = "appcore-example"
version = "0.1.0"
edition = "2021"
rust-version = "1.89"

[dependencies]
appcore-bin = { version = "=1.0.0", default-features = false }
```

Le pin exact garde ce tutoriel reproductible avec le contrat stable 1.0.

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

La command apparaît deux fois pour des raisons différentes : le manifest
publie le contrat portable ; le code Rust enregistre son implémentation.

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

Le loopback sans TLS sert uniquement au développement local.

## Code métier

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

## Générer un secret local structuré

Les secrets bruts sont rejetés par l'update wall actuelle. Générer un matériau
structuré et aléatoire pour cette session shell :

```bash
now_ms="$(($(date +%s) * 1000))"
export APPCORE_EXAMPLE_SECRET="$(printf \
  'key_id=local-%s\ncreated_at_ms=%s\nexpires_at_ms=none\nstatus=active\nsecret=hex:%s\n' \
  "$now_ms" "$now_ms" "$(openssl rand -hex 32)")"
```

Ne pas committer ni afficher cette valeur.

## Exécuter et inspecter

```bash
APPCORE_APPLICATION_MANIFEST=application.toml \
APPCORE_DEPLOYMENT_MANIFEST=deployment.toml \
cargo run
```

Dans un autre terminal :

```bash
curl -s http://127.0.0.1:39300/v1/health
curl -s http://127.0.0.1:39300/v1/status/public
```

`/health` et `/status` sont des interfaces supprimées qui retournent l'update
wall. Utiliser seulement les routes `/v1/*`.

## Échecs attendus à tester

- Retirer l'idempotency key d'une vraie request `app.ping`.
- Modifier `application_id` dans un seul manifest.
- Retirer `APPCORE_EXAMPLE_SECRET`.
- Remplacer le secret structuré par une chaîne aléatoire brute.

Les quatre cas doivent échouer avant une exécution métier non contrôlée.

Suivant : [émettre un event et ajouter une query](./command-event-query).
