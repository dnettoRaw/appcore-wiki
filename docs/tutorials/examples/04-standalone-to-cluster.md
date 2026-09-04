---
title: 4. Standalone to Cluster
sidebar_position: 4
---

# 4. Standalone to Cluster

Keep the Application Manifest and business code unchanged. Supply a different
Deployment Manifest to the deployment executable:

- standalone selects local providers and rejects distributed roles;
- cluster explicitly selects control plane, coordination, discovery, peer
  transport, storage, and secret references;
- missing or unknown required providers fail startup instead of falling back.

Application code can validate either explicit manifest through the same SDK
shape:

```rust
App::new("example-app")?
    .application_manifest(application)?
    .deployment_manifest(deployment)?
    .run(|app| {
        app.log("explicit V1 manifests are valid");
        Ok(())
    })?;
```

This validates application-facing inputs. Starting cluster services remains a
deployment responsibility and requires operated authentication, TLS, storage,
backup, recovery, capacity, and failure evidence.

Return to the [examples index](./).
