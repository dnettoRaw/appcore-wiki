---
title: Contrato de três artefatos
sidebar_position: 2
---

# Contrato de três artefatos

O objetivo mensurável do AppCore 1.0 é: uma aplicação roda fornecendo apenas `application.toml`, `deployment.toml` e código de negócio que implementa `appcore_sdk::Application`.

1. `application.toml`
2. `deployment.toml`
3. código de negócio implementando `appcore_sdk::Application`

Esse contrato existe para impedir que identidade de aplicação, política de instalação e composição de runtime se misturem no mesmo arquivo. Quando isso acontece, cada instalação vira um fork implícito.

Porque existem três donos diferentes. O autor da aplicação sabe quais commands existem. O operador sabe onde a aplicação roda. O runtime sabe como compor providers, lifecycle e serviços.

## Application Manifest

É portável e pertence ao autor da aplicação. Declara identidade, versão, vendor, service ID, runtime mínimo, protocolo, capabilities, idempotência, liderança, storage, scheduler, jobs, health e update policy.

Ele possui:

- identidade e versão da aplicação;
- display name, vendor e service ID;
- versão mínima do Runtime e protocol version;
- capabilities e seus modos command/query/stream;
- requisitos de idempotência e liderança;
- requisitos de storage, scheduler, jobs, health e update;
- módulos, feature flags e metadata não sensível.

Não contém provider IDs, paths, endpoints, TLS, tokens, senhas ou chaves.

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

Pertence ao instalador/operador. Seleciona modo, providers, paths, rede, secret references e watchdog.

Ele possui:

- identidade da instalação;
- modo standalone ou cluster;
- providers selecionados;
- paths de storage e backup;
- bindings de environment e volumes;
- listeners de rede e transports;
- secret references;
- policy do watchdog do Supervisor.

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

Secrets são referências. Paths relativos resolvem a partir do deployment manifest. Standalone rejeita coordenação distribuída; cluster exige providers compatíveis.

## Código de negócio

O código registra commands, events, states, decisions, handlers, queries e tasks. Ele não constrói storage provider, listener HTTP, token provider, scheduler, sync ou supervisor.

O Runtime chama os pontos controlados:

- `configure` recebe bindings validados do deployment;
- `register_commands` declara nomes de commands;
- `register_events`, `register_states` e `register_decisions` expõem contratos;
- `register_handlers` conecta command handlers;
- `register_queries` registra endpoints sem side effects;
- `register_tasks` registra definições limitadas de tasks em background.

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

## O quarto artefato proibido

Uma aplicação AppCore 1.0 não deve precisar de `RuntimeBuilder` construído à
mão, módulo de host privado, configuração do Runtime sem versão ou fork do
Runtime. Metadata do Cargo e o pequeno `main` são integração de build, não
artefatos de arquitetura.

## Por que essa separação importa

O mesmo código de negócio pode passar de standalone local para cluster mudando
somente a policy do deployment. Essa é a principal garantia de compatibilidade
do AppCore.

## Limitations

- O contrato não elimina trabalho de deployment; operators ainda escolhem providers, paths, listeners e secret refs.
- O Application Manifest declara capabilities vistas pelo runtime, não todo o schema de domínio.
- O Deployment Manifest não é portável quando contém paths e choices locais.
- Handlers continuam responsáveis por idempotência correta quando o manifest exige idempotency.
- Caminhos privados de `RuntimeBuilder` ficam fora do contrato de aplicação.

Próximo: [bootstrap](/architecture/bootstrap).
