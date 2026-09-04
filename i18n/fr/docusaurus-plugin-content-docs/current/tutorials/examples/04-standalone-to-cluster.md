---
title: 4. Standalone vers Cluster
sidebar_position: 4
---

# 4. Standalone vers Cluster

Conservez l'Application Manifest et le code métier. Fournissez un autre
Deployment Manifest à l'exécutable de déploiement :

- standalone sélectionne les providers locaux et refuse les rôles distribués ;
- cluster sélectionne explicitement control plane, coordination, discovery,
  transport peer, stockage et références de secrets ;
- un provider requis absent ou inconnu échoue sans fallback.

La même forme SDK valide tout manifeste explicite :

```rust
App::new("example-app")?
    .application_manifest(application)?
    .deployment_manifest(deployment)?
    .run(|app| {
        app.log("les manifestes V1 explicites sont valides");
        Ok(())
    })?;
```

Cela valide les entrées applicatives. Le démarrage des services cluster reste
une responsabilité du déploiement et exige des preuves d'authentification,
TLS, stockage, sauvegarde, récupération, capacité et défaillance.

Retour à l'[index des exemples](./).
