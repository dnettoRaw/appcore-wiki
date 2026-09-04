---
title: 4. Standalone para Cluster
sidebar_position: 4
---

# 4. Standalone para Cluster

Mantenha o Application Manifest e o código de negócio. Forneça outro Deployment
Manifest ao executável de deployment:

- standalone seleciona providers locais e rejeita papéis distribuídos;
- cluster seleciona explicitamente control plane, coordenação, discovery,
  transporte peer, storage e referências de secrets;
- providers obrigatórios ausentes ou desconhecidos falham sem fallback.

O mesmo formato do SDK valida qualquer manifest explícito:

```rust
App::new("example-app")?
    .application_manifest(application)?
    .deployment_manifest(deployment)?
    .run(|app| {
        app.log("manifests V1 explícitos são válidos");
        Ok(())
    })?;
```

Isso valida as entradas da aplicação. Iniciar serviços de cluster continua
responsabilidade do deployment e exige evidências de autenticação, TLS,
storage, backup, recovery, capacidade e falhas.

Volte ao [índice de exemplos](./).
