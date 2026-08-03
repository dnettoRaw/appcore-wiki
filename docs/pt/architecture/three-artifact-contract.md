---
title: Contrato de três artefatos
sidebar_position: 2
---

# Contrato de três artefatos

O objetivo mensurável do AppCore 1.0 é: uma aplicação roda fornecendo apenas `application.toml`, `deployment.toml` e código de negócio que implementa `appcore_bin::application::Application`.

## Application Manifest

É portável e pertence ao autor da aplicação. Declara identidade, versão, vendor, service ID, runtime mínimo, protocolo, capabilities, idempotência, liderança, storage, scheduler, jobs, health e update policy.

Não contém provider IDs, paths, endpoints, TLS, tokens, senhas ou chaves.

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

Pertence ao instalador/operador. Seleciona modo, providers, paths, rede, secret references e watchdog.

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

Secrets são referências. Paths relativos resolvem a partir do deployment manifest. Standalone rejeita coordenação distribuída; cluster exige providers compatíveis.

## Código de negócio

O código registra commands, events, states, decisions, handlers, queries e tasks. Ele não constrói storage provider, listener HTTP, token provider, scheduler, sync ou supervisor.

```rust
fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

Um quarto artefato, como `RuntimeBuilder` customizado ou configuração sem versão, viola o contrato 1.0.

Próximo: [bootstrap](/pt/architecture/bootstrap).

