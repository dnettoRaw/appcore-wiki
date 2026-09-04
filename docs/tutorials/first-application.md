---
title: Build the First Application
sidebar_position: 11
---

# Build the First Application

This tutorial shows the application boundary without inventing a product or
hiding Runtime infrastructure in business code. An AppCore application owns
exactly an Application Manifest, a Deployment Manifest, and business code.

## 1. Add the application facade

Until the current SDK release is published, use the local checkout explicitly:

```toml
[dependencies]
appcore-sdk = { path = "../AppCore-Runtime/crates/appcore-sdk" }
```

After publication, replace only the dependency source with the released
`appcore-sdk` version. Do not replace it with a low-level host crate.

## 2. Prove the smallest local application

```rust
use appcore_sdk::prelude::*;

fn main() -> AppResult<()> {
    appcore_sdk::run("example-app", |app| {
        let log = app.logger().component("startup");
        log.info("application context is valid");
        Ok(())
    })
}
```

`run` validates the application ID and supplies canonical local V1 manifests
and bounded logging. It does not open a listener, select a provider, or start a
hidden Runtime host.

## 3. Declare business behavior

Implement `Application` when the deployment must register commands, events,
queries, decisions, states, handlers, or tasks:

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

The selected deployment process calls these hooks while composing Runtime
services. Application code registers behavior; it does not construct storage,
HTTP, security, or Supervisor internals.

## 4. Add the two manifests

`application.toml` declares portable identity and requirements:

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

`deployment.toml` is installation-owned and selects mode, providers, paths,
network, and secret references. It contains references such as
`env:APPCORE_RUNTIME_KEY`, never a secret value. Use the complete validated
[three-artifact fixture](https://github.com/dnettoraw/AppCore-Runtime/tree/beta/tests/three-artifact-app)
instead of guessing omitted required fields.

## 5. Grow only when needed

Enable `api`, `scheduler`, `deployment`, `storage`, `sync`, `ai`, or
`filemaker` only when the application consumes that capability. The SDK
[reference](/crates/appcore-sdk) describes each namespace, and the
[stable crate registry](/crates/registry) identifies every lower-level owner.

Test malformed manifests, undeclared commands, missing idempotency keys,
provider failure, and bounded shutdown in the deployment that hosts the
application. The local `run` example alone is not proof of HTTP, clustering,
storage, or production secret management.
