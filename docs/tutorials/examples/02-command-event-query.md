---
title: 2. Command, Event, and Query
sidebar_position: 2
---

# 2. Command, Event, and Query

This stage replaces the ping with a write path (`example.echo`), its immutable
fact (`example.echoed`), and a side-effect-free read (`example.echo.read`).

## Extend the Application Manifest

Set `service_id = "example.echo"` and replace the capability entry with:

```toml title="application.toml"
[[capabilities]]
id = "example.echo"
version = "1"
mode = "command"
visibility = "local"
requires_leader = false
idempotency_required = true

[[capabilities]]
id = "example.echo.read"
version = "1"
mode = "query"
visibility = "local"
requires_leader = false
idempotency_required = false
```

The manifest does not declare `example.echoed` as an invokable capability. It
is an event produced by accepted business behavior.

## Register the behavior

Replace `src/main.rs` with:

```rust title="src/main.rs"
use appcore_bin::application::{
    ApiRequest, ApiResponse, ApiRouter, Application, CommandBus,
    CommandEnvelope, CommandHandler, CommandName, CommandRegistry,
    CommandResult, EventEnvelope, EventName, EventRegistry, QueryEndpoint,
    QueryName, RuntimeContext, RuntimeResult,
};

struct EchoApplication;

impl Application for EchoApplication {
    fn register_commands(&self, registry: &mut CommandRegistry) -> RuntimeResult<()> {
        registry.register(CommandName::new("example.echo")?)
    }

    fn register_events(&self, registry: &mut EventRegistry) -> RuntimeResult<()> {
        registry.register(EventName::new("example.echoed")?)
    }

    fn register_handlers(&self, bus: &mut CommandBus) -> RuntimeResult<()> {
        bus.register_handler(EchoHandler)
    }

    fn register_queries(&self, router: &mut ApiRouter) -> RuntimeResult<()> {
        router.register_query(EchoQuery)
    }
}

struct EchoHandler;

impl CommandHandler for EchoHandler {
    fn command_name(&self) -> CommandName {
        CommandName::new("example.echo").expect("static command name")
    }

    fn handle(
        &self,
        command: &CommandEnvelope,
        _context: &dyn RuntimeContext,
    ) -> RuntimeResult<CommandResult> {
        let event = EventEnvelope::new(
            EventName::new("example.echoed")?,
            format!("event-{}", command.command_id),
            command.app_id.clone(),
            command.node_id.clone(),
            command.issued_at_ms,
            command.payload.clone(),
        )?;
        Ok(CommandResult::accepted(vec![event]))
    }
}

struct EchoQuery;

impl QueryEndpoint for EchoQuery {
    fn query_name(&self) -> &QueryName {
        static NAME: std::sync::OnceLock<QueryName> = std::sync::OnceLock::new();
        NAME.get_or_init(|| {
            QueryName::new("example.echo.read").expect("static query name")
        })
    }

    fn handle_query(&self, request: ApiRequest) -> RuntimeResult<ApiResponse> {
        Ok(ApiResponse {
            status_code: 200,
            payload: request.payload,
        })
    }
}

fn main() {
    if let Err(error) =
        appcore_bin::application::run_application(&EchoApplication)
    {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

The command handler validates/mutates business state in a real application and
returns facts through `CommandResult`. The query must not write state.

## Test without constructing Runtime infrastructure

Add a development dependency:

```toml title="Cargo.toml"
[dev-dependencies]
serde_json = "1"
```

Append this single round-trip test to `src/main.rs`:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use appcore_bin::application::{
        CommandRequest, ManifestApplicationHost, QueryRequest,
    };
    use serde_json::json;
    use std::path::Path;

    #[test]
    fn command_and_query_round_trip() {
        let root = Path::new(env!("CARGO_MANIFEST_DIR"));
        let host = ManifestApplicationHost::load(
            root.join("application.toml"),
            root.join("deployment.toml"),
            &EchoApplication,
        )
        .expect("manifest-first host");

        let missing_key = host.dispatch_command(CommandRequest {
            command_name: "example.echo".to_string(),
            command_id: "cmd-missing-key".to_string(),
            idempotency_key: None,
            payload: "hello".to_string(),
        });
        assert!(missing_key.is_err());

        let result = host
            .dispatch_command(CommandRequest {
                command_name: "example.echo".to_string(),
                command_id: "cmd-1".to_string(),
                idempotency_key: Some("idem-1".to_string()),
                payload: "hello".to_string(),
            })
            .expect("command dispatch");
        assert!(result.is_accepted());
        assert_eq!(result.events().len(), 1);
        assert_eq!(host.audit_len(), 1);

        let response = host
            .dispatch_query(QueryRequest {
                query_name: "example.echo.read".to_string(),
                query_id: "query-1".to_string(),
                payload: json!({"message": "hello"}),
            })
            .expect("query dispatch");
        assert!(response.ok);
        assert_eq!(response.payload, json!({"message": "hello"}));

        host.shutdown().expect("clean shutdown");
    }
}
```

With the structured secret from level 1 still exported:

```bash
cargo test
```

The HTTP `/v1/command` and `/v1/query` routes additionally require
Runtime-issued, least-privilege tokens. The direct host test focuses on the
application contract and does not weaken transport authentication.

Next: [register bounded scheduled work](./scheduled-task).
