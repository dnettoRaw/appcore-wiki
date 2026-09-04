---
title: 1. Menor Aplicação Local
sidebar_position: 1
---

# 1. Menor Aplicação Local

Adicione a fachada:

```toml title="Cargo.toml"
[dependencies]
appcore-sdk = "1.0.0-rc.1"
```

Depois valide os manifests locais canônicos e use logging limitado:

```rust title="src/main.rs"
use appcore_sdk::prelude::*;

fn main() -> AppResult<()> {
    appcore_sdk::run("example-app", |app| {
        app.logger()
            .component("startup")
            .info("contexto da aplicação é válido");
        Ok(())
    })
}
```

`run` não abre listener, escolhe providers ou inicia host oculto. Ao sair dos
defaults locais, a aplicação continua dona de `application.toml`,
`deployment.toml` e do código de negócio.

Próximo: [registre o comportamento da aplicação](./command-event-query).
