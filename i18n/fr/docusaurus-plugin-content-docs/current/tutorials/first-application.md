---
title: Créer la première application
sidebar_position: 11
---

# Créer la première application

Ce tutoriel montre la frontière applicative sans inventer un produit ni cacher
l’infrastructure Runtime dans le code métier. Une application AppCore possède
exactement un Application Manifest, un Deployment Manifest et du code métier.

## 1. Ajouter la façade applicative

Jusqu’à la publication de la version SDK courante, utilisez explicitement le
checkout local :

```toml
[dependencies]
appcore-sdk = { path = "../AppCore-Runtime/crates/appcore-sdk" }
```

Après publication, remplacez uniquement la source par la version publiée de
`appcore-sdk`. Ne la remplacez pas par un crate de host de bas niveau.

## 2. Vérifier l’application locale minimale

```rust
use appcore_sdk::prelude::*;

fn main() -> AppResult<()> {
    appcore_sdk::run("example-app", |app| {
        let log = app.logger().component("startup");
        log.info("le contexte applicatif est valide");
        Ok(())
    })
}
```

`run` valide l’identifiant d’application et fournit des manifestes V1 locaux
canoniques ainsi qu’un log borné. Il n’ouvre aucun listener, ne choisit aucun
provider et ne démarre pas un host Runtime caché.

## 3. Déclarer le comportement métier

Implémentez `Application` lorsque le déploiement doit enregistrer commands,
events, queries, decisions, states, handlers ou tasks :

```rust
use appcore_sdk::application::{CommandName, CommandRegistry, RuntimeResult};
use appcore_sdk::Application;

struct ExampleApplication;

impl Application for ExampleApplication {
    fn register_commands(
        &self,
        registry: &mut CommandRegistry,
    ) -> RuntimeResult<()> {
        registry.register(CommandName::new("example.ping")?)
    }
}
```

Le processus de déploiement choisi appelle ces hooks lorsqu’il compose les
services Runtime. Le code applicatif enregistre le comportement ; il ne
construit pas les internals de stockage, HTTP, sécurité ou Supervisor.

## 4. Ajouter les deux manifestes

`application.toml` déclare l’identité et les exigences portables :

```toml
manifest_version = 1
application_id = "example-app"
application_version = "1.0.0"
display_name = "Example App"
vendor = "example-vendor"
service_id = "example.ping"

[runtime]
minimum_runtime_version = "1.0.0"
protocol_version = "1"

[[capabilities]]
id = "example.ping"
version = "1"
mode = "command"
visibility = "local"
requires_leader = false
idempotency_required = true
```

`deployment.toml` appartient à l’installation et sélectionne mode, providers,
chemins, réseau et références de secrets. Il contient des références telles
que `env:APPCORE_RUNTIME_KEY`, jamais la valeur du secret. Utilisez la
[fixture complète des trois artefacts](https://github.com/dnettoraw/AppCore-Runtime/tree/beta/tests/three-artifact-app)
validée au lieu de deviner les champs obligatoires omis.

## 5. N’ajouter que ce qui est nécessaire

Activez `api`, `scheduler`, `deployment`, `storage`, `sync`, `ai` ou
`filemaker` uniquement lorsque l’application consomme cette capability. La
[référence SDK](/fr/crates/appcore-sdk) décrit chaque namespace et le
[registre stable](/fr/crates/registry) identifie chaque propriétaire de niveau
inférieur.

Testez manifestes invalides, commands non déclarées, clé d’idempotence absente,
échec de provider et arrêt borné dans le déploiement qui héberge l’application.
L’exemple local `run` ne prouve pas à lui seul HTTP, cluster, stockage ou la
gestion des secrets de production.
