---
title: Crie a primeira aplicação
sidebar_position: 11
---

# Crie a primeira aplicação

Este tutorial mostra a fronteira da aplicação sem inventar um produto nem
esconder infraestrutura do Runtime no código de negócio. Uma aplicação AppCore
possui exatamente um Application Manifest, um Deployment Manifest e código de
negócio.

## 1. Adicione a facade da aplicação

Até a publicação da release atual do SDK, use o checkout local explicitamente:

```toml
[dependencies]
appcore-sdk = { path = "../AppCore-Runtime/crates/appcore-sdk" }
```

Depois da publicação, troque somente a origem da dependência pela versão
lançada de `appcore-sdk`. Não substitua por um crate de host de baixo nível.

## 2. Comprove a aplicação local mínima

```rust
use appcore_sdk::prelude::*;

fn main() -> AppResult<()> {
    appcore_sdk::run("example-app", |app| {
        let log = app.logger().component("startup");
        log.info("contexto da aplicação está válido");
        Ok(())
    })
}
```

`run` valida o ID da aplicação e fornece manifestos V1 locais canônicos e log
limitado. Ele não abre listener, escolhe provider nem inicia um host Runtime
escondido.

## 3. Declare o comportamento de negócio

Implemente `Application` quando o deployment precisar registrar commands,
events, queries, decisions, states, handlers ou tasks:

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

O processo de deployment escolhido chama esses hooks ao compor os serviços do
Runtime. O código da aplicação registra comportamento; ele não constrói
internals de storage, HTTP, segurança ou Supervisor.

## 4. Adicione os dois manifestos

`application.toml` declara identidade e requisitos portáteis:

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

`deployment.toml` pertence à instalação e seleciona modo, providers, paths,
rede e referências de segredo. Ele contém referências como
`env:APPCORE_RUNTIME_KEY`, nunca o valor do segredo. Use a
[fixture completa dos três artefatos](https://github.com/dnettoraw/AppCore-Runtime/tree/beta/tests/three-artifact-app)
validada em vez de adivinhar campos obrigatórios omitidos.

## 5. Cresça somente quando necessário

Ative `api`, `scheduler`, `deployment`, `storage`, `sync`, `ai` ou `filemaker`
somente quando a aplicação consumir essa capability. A
[referência do SDK](/pt/crates/appcore-sdk) descreve cada namespace, e o
[registro estável](/pt/crates/registry) identifica cada owner de nível
inferior.

Teste manifestos inválidos, commands não declarados, ausência de chave de
idempotência, falha de provider e shutdown limitado no deployment que hospeda a
aplicação. O exemplo local com `run`, sozinho, não comprova HTTP, cluster,
storage nem gerenciamento de segredos de produção.
