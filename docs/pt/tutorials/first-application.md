---
title: Primeira aplicação
sidebar_position: 11
---

# Primeira aplicação

O template mínimo registra um command e um handler. A entrada deve continuar pequena:

```rust
fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

O command precisa existir no Application Manifest:

```toml
[[capabilities]]
id = "app.ping"
version = "1"
mode = "command"
idempotency_required = true
```

O deployment escolhe provider e listener:

```toml
mode = "standalone"
secrets = { runtime_security = "env:APPCORE_BACKEND_TEMPLATE_SECRET" }
paths = { storage = "target/runtime/storage", backup = "target/runtime/backups" }

[storage]
provider_id = "file"

[network]
listen_addresses = ["127.0.0.1:39300"]
```

Teste a seguir: mismatch de manifest, command não declarado, idempotency ausente, path traversal em storage e shutdown cooperativo.

