---
title: 1. Smallest Local Application
sidebar_position: 1
---

# 1. Smallest Local Application

Add the facade:

```toml title="Cargo.toml"
[dependencies]
appcore-sdk = "1.0.0-rc.1"
```

Then validate the canonical local manifests and use bounded logging:

```rust title="src/main.rs"
use appcore_sdk::prelude::*;

fn main() -> AppResult<()> {
    appcore_sdk::run("example-app", |app| {
        app.logger()
            .component("startup")
            .info("application context is valid");
        Ok(())
    })
}
```

`run` does not open a listener, choose providers, or start a hidden host. The
application still owns `application.toml`, `deployment.toml`, and its business
code when moving beyond canonical local defaults.

Next: [register application behavior](./command-event-query).
