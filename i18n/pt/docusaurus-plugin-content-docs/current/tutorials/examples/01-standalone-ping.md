---
title: 1. Ping standalone
sidebar_position: 1
---

# 1. Ping standalone

Esta aplicação mínima completa registra `app.ping`, inicia o host
manifest-first e expõe rotas versionadas de health e status.

## Estrutura do projeto

```text
appcore-example/
├── Cargo.toml
├── application.toml
├── deployment.toml
└── src/
    └── main.rs
```

## Dependência Cargo

```toml title="Cargo.toml"
[package]
name = "appcore-example"
version = "0.1.0"
edition = "2021"
rust-version = "1.89"

[dependencies]
appcore-bin = { version = "=1.0.0", default-features = false }
```

O pin exato mantém o tutorial reproduzível contra o contrato estável 1.0.

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

O command aparece duas vezes por motivos diferentes: o manifest publica o
contrato portável; o código Rust registra a implementação.

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

Loopback sem TLS serve apenas para desenvolvimento local.

## Código de negócio

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

## Gere um secret estruturado local

Secrets crus são rejeitados pela update wall atual. Gere material estruturado e
aleatório para esta sessão do shell:

```bash
now_ms="$(($(date +%s) * 1000))"
export APPCORE_EXAMPLE_SECRET="$(printf \
  'key_id=local-%s\ncreated_at_ms=%s\nexpires_at_ms=none\nstatus=active\nsecret=hex:%s\n' \
  "$now_ms" "$now_ms" "$(openssl rand -hex 32)")"
```

Não faça commit nem imprima esse valor.

## Execute e inspecione

```bash
APPCORE_APPLICATION_MANIFEST=application.toml \
APPCORE_DEPLOYMENT_MANIFEST=deployment.toml \
cargo run
```

Em outro terminal:

```bash
curl -s http://127.0.0.1:39300/v1/health
curl -s http://127.0.0.1:39300/v1/status/public
```

`/health` e `/status` são interfaces removidas e retornam a update wall. Use
somente rotas `/v1/*`.

## Falhas esperadas para testar

- Remova a idempotency key de um request real para `app.ping`.
- Altere `application_id` em apenas um manifest.
- Remova `APPCORE_EXAMPLE_SECRET`.
- Troque o secret estruturado por uma string aleatória crua.

Os quatro casos devem falhar antes de execução de negócio não controlada.

Próximo: [emitir event e adicionar query](./command-event-query).
