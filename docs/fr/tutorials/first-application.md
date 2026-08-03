---
title: Première application
sidebar_position: 11
---

# Première application

Le but n'est pas de créer un produit complet. Le but est de voir la frontière : le code métier déclare le comportement, les manifests déclarent le contrat, le deployment choisit l'environnement.

Le template minimal enregistre une command et un handler. L'entrée reste petite :

```rust
fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

La command doit exister dans l'Application Manifest :

```toml
[[capabilities]]
id = "app.ping"
version = "1"
mode = "command"
idempotency_required = true
```

Le deployment choisit provider et listener :

```toml
mode = "standalone"
secrets = { runtime_security = "env:APPCORE_BACKEND_TEMPLATE_SECRET" }
paths = { storage = "target/runtime/storage", backup = "target/runtime/backups" }

[storage]
provider_id = "file"

[network]
listen_addresses = ["127.0.0.1:39300"]
```

Tests suivants : mismatch de manifest, command non déclarée, idempotency absente, path traversal dans storage et shutdown coopératif.

## Limitations

- L'exemple utilise une command minimale et ne modélise pas un workflow métier.
- Il suppose la facade publique `appcore_bin::application`.
- Il démontre un deployment local standalone, pas un cluster complet.
- Il ne couvre pas provider custom ni gestion de secrets en production.
