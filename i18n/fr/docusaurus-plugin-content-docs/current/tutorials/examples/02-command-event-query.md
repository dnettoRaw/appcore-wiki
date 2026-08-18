---
title: 2. Command, Event et Query
sidebar_position: 2
---

# 2. Command, Event et Query

Cette étape remplace le ping par un chemin d'écriture (`example.echo`), le fait
immuable qu'il produit (`example.echoed`) et une lecture sans effet de bord
(`example.echo.read`).

## Étendre l'Application Manifest

Définir `service_id = "example.echo"` et remplacer l'entrée de capability par :

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

Le manifest ne déclare pas `example.echoed` comme capability invocable. C'est
un event produit par un comportement métier accepté.

## Enregistrer le comportement

Remplacer `src/main.rs` par :

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

Dans une application réelle, le command handler valide ou modifie l'état
métier, puis retourne les faits via `CommandResult`. La query ne doit pas
écrire d'état.

## Tester sans construire l'infrastructure Runtime

Ajouter une dépendance de développement :

```toml title="Cargo.toml"
[dev-dependencies]
serde_json = "1"
```

Ajouter ce test aller-retour unique à la fin de `src/main.rs` :

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

Avec le secret structuré du niveau 1 toujours exporté :

```bash
cargo test
```

Les routes HTTP `/v1/command` et `/v1/query` exigent en plus des tokens de
moindre privilège émis par le Runtime. Le test direct du host se concentre sur
le contrat applicatif sans affaiblir l'authentification du transport.

Suite : [enregistrer une tâche planifiée bornée](./scheduled-task).
