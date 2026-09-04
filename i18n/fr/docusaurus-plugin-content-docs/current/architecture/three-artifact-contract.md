---
title: Le contrat à trois artefacts
sidebar_position: 2
---

# Le contrat à trois artefacts

L'objectif mesurable d'AppCore 1.0 est : une application tourne avec seulement `application.toml`, `deployment.toml` et du code métier implémentant `appcore_sdk::Application`.

1. `application.toml`
2. `deployment.toml`
3. code métier implémentant `appcore_sdk::Application`

Ce contrat évite de mélanger identité applicative, politique d'installation et composition runtime dans le même fichier. Quand ces responsabilités se mélangent, chaque installation devient un fork implicite.

Parce qu'il y a trois propriétaires. L'auteur connaît les commands. L'opérateur connaît l'environnement. Le runtime sait composer providers, lifecycle et services.

## Application Manifest

Portable et détenu par l'auteur de l'application. Il déclare identité, version, vendor, service ID, runtime minimum, protocole, capabilities, idempotence, leadership, storage, scheduler, jobs, health et update policy.

Il possède :

- identité et version de l'application ;
- display name, vendor et service ID ;
- version Runtime minimale et protocol version ;
- capabilities et leurs modes command/query/stream ;
- exigences d'idempotence et leadership ;
- exigences storage, scheduler, jobs, health et update ;
- modules, feature flags et metadata non sensible.

Il ne contient pas provider IDs, chemins, endpoints, TLS, tokens, mots de passe ou clés.

```toml
manifest_version = 1
application_id = "example-app"
application_version = "0.1.0"
display_name = "Example App"
vendor = "Example Vendor"
service_id = "app.ping"

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
```

## Deployment Manifest

Il appartient à l'installateur/opérateur. Il sélectionne mode, providers, chemins, réseau, secret references et watchdog.

Il possède :

- identité de l'installation ;
- mode standalone ou cluster ;
- providers sélectionnés ;
- chemins storage et backup ;
- bindings environment et volumes ;
- listeners réseau et transports ;
- secret references ;
- policy du watchdog Supervisor.

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

[supervisor.watchdog]
enabled = true
check_interval_ms = 1000
stall_timeout_ms = 15000
```

Les secrets sont des références. Les chemins relatifs sont résolus depuis le deployment manifest. Standalone rejette la coordination distribuée ; cluster exige des providers compatibles.

## Code métier

Le code enregistre commands, events, states, decisions, handlers, queries et tasks. Il ne construit pas storage provider, listener HTTP, token provider, scheduler, sync ou supervisor.

Le Runtime appelle les points contrôlés :

- `configure` reçoit les bindings validés du deployment ;
- `register_commands` déclare les noms de commands ;
- `register_events`, `register_states`, `register_decisions` exposent les contrats ;
- `register_handlers` connecte les command handlers ;
- `register_queries` enregistre les endpoints sans side effects ;
- `register_tasks` enregistre les définitions bornées de tasks en arrière-plan.

```rust
use appcore_sdk::application::{
    Application, CommandBus, CommandEnvelope, CommandHandler, CommandName,
    CommandRegistry, CommandResult, NodeId, RuntimeContext, RuntimeResult,
};
use appcore_sdk::{App, AppResult};

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

fn main() -> AppResult<()> {
    let app = App::new("example-app")?;
    let prepared = app.prepare(
        &BackendApplication,
        NodeId::new("example-local")?,
    )?;

    assert_eq!(prepared.runtime().commands().len(), 1);
    Ok(())
}
```

## Le quatrième artefact interdit

Une application AppCore 1.0 ne doit pas avoir besoin d'un `RuntimeBuilder`
construit à la main, d'un module host privé, d'une configuration Runtime sans
version ou d'un fork du Runtime. Les metadata Cargo et le petit `main` relèvent
de l'intégration de build, pas des artefacts d'architecture.

## Pourquoi cette séparation est importante

Le même code métier peut passer du mode standalone local à un cluster en ne
changeant que la policy du deployment. C'est la principale garantie de
compatibilité d'AppCore.

## Limitations

- Le contrat n'élimine pas le travail de deployment ; l'opérateur choisit encore providers, chemins, listeners et secret refs.
- L'Application Manifest déclare les capabilities visibles par le runtime, pas tout le schéma métier.
- Le Deployment Manifest n'est pas portable lorsqu'il contient chemins et choix locaux.
- Les handlers restent responsables de l'idempotency quand le manifest l'exige.
- Les chemins privés de `RuntimeBuilder` restent hors contrat applicatif.

Suivant : [bootstrap](/fr/architecture/bootstrap).
