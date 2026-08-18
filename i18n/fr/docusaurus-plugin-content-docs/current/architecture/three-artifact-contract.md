---
title: Le contrat à trois artefacts
sidebar_position: 2
---

# Le contrat à trois artefacts

L'objectif mesurable d'AppCore 1.0 est : une application tourne avec seulement `application.toml`, `deployment.toml` et du code métier implémentant `appcore_bin::application::Application`.

Ce contrat évite de mélanger identité applicative, politique d'installation et composition runtime dans le même fichier. Quand ces responsabilités se mélangent, chaque installation devient un fork implicite.

## Pourquoi trois artefacts ?

Parce qu'il y a trois propriétaires. L'auteur connaît les commands. L'opérateur connaît l'environnement. Le runtime sait composer providers, lifecycle et services.

## Application Manifest

Portable et détenu par l'auteur de l'application. Il déclare identité, version, vendor, service ID, runtime minimum, protocole, capabilities, idempotence, leadership, storage, scheduler, jobs, health et update policy.

Il ne contient pas provider IDs, chemins, endpoints, TLS, tokens, mots de passe ou clés.

```toml
manifest_version = 1
application_id = "backend-template"
application_version = "0.1.0"
service_id = "app.ping"

[runtime]
minimum_runtime_version = "1.0.0-rc.3"
protocol_version = "1"

[[capabilities]]
id = "app.ping"
version = "1"
mode = "command"
requires_leader = false
idempotency_required = true
```

## Deployment Manifest

Il appartient à l'installateur/opérateur. Il sélectionne mode, providers, chemins, réseau, secret references et watchdog.

```toml
manifest_version = 1
installation_id = "backend-template-local"
application_id = "backend-template"
mode = "standalone"
secrets = { runtime_security = "env:APPCORE_BACKEND_TEMPLATE_SECRET" }
paths = { storage = "target/runtime/storage", backup = "target/runtime/backups" }

[storage]
provider_id = "file"

[network]
listen_addresses = ["127.0.0.1:39300"]
peer_transport = "http"
command_transport = "http"
```

Les secrets sont des références. Les chemins relatifs sont résolus depuis le deployment manifest. Standalone rejette la coordination distribuée ; cluster exige des providers compatibles.

## Code métier

Le code enregistre commands, events, states, decisions, handlers, queries et tasks. Il ne construit pas storage provider, listener HTTP, token provider, scheduler, sync ou supervisor.

```rust
fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

Un quatrième artefact, comme un `RuntimeBuilder` custom ou une configuration non versionnée, viole le contrat 1.0.

## Limitations

- Le contrat n'élimine pas le travail de deployment ; l'opérateur choisit encore providers, chemins, listeners et secret refs.
- L'Application Manifest déclare les capabilities visibles par le runtime, pas tout le schéma métier.
- Le Deployment Manifest n'est pas portable lorsqu'il contient chemins et choix locaux.
- Les handlers restent responsables de l'idempotency quand le manifest l'exige.
- Les chemins privés de `RuntimeBuilder` restent hors contrat applicatif.

Suivant : [bootstrap](/architecture/bootstrap).
