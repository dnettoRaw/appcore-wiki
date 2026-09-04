---
title: 1. Application Locale Minimale
sidebar_position: 1
---

# 1. Application Locale Minimale

Ajoutez la façade :

```toml title="Cargo.toml"
[dependencies]
appcore-sdk = "1.0.0-rc.1"
```

Validez ensuite les manifestes locaux canoniques et utilisez le logging borné :

```rust title="src/main.rs"
use appcore_sdk::prelude::*;

fn main() -> AppResult<()> {
    appcore_sdk::run("example-app", |app| {
        app.logger()
            .component("startup")
            .info("le contexte applicatif est valide");
        Ok(())
    })
}
```

`run` n'ouvre aucun listener, ne choisit pas de provider et ne démarre pas de
host caché. Au-delà des valeurs locales par défaut, l'application conserve
`application.toml`, `deployment.toml` et son code métier.

Suite : [enregistrer le comportement applicatif](./command-event-query).
