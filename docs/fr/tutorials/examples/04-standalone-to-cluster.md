---
title: 4. De Standalone à Cluster
sidebar_position: 4
---

# 4. De Standalone à Cluster

Le test d'architecture intermédiaire est simple : conserver `application.toml`
et `src/main.rs` inchangés, puis sélectionner l'infrastructure cluster avec un
second Deployment Manifest.

## Ajouter un déploiement cluster

```toml title="deployment.cluster.toml"
manifest_version = 1
installation_id = "appcore-example-cluster"
application_id = "appcore-example"
mode = "cluster"
secrets = { runtime_security = "env:APPCORE_EXAMPLE_SECRET" }
paths = { storage = "target/runtime/cluster/storage", backup = "target/runtime/cluster/backups" }
volumes = []
adapters = {}
environment = { EXAMPLE_MODE = { kind = "literal", value = "cluster" } }

[supervisor.watchdog]
enabled = true
check_interval_ms = 1000
stall_timeout_ms = 15000

[storage]
provider_id = "file"
settings = {}
secret_refs = {}

[control_plane]
provider_id = "file-control-plane"
settings = { path = "target/runtime/cluster/control-plane", retention_ms = "86400000", heartbeat_interval_ms = "100" }
secret_refs = {}

[coordination_store]
provider_id = "file-coordination-v2"
settings = { path = "target/runtime/cluster/control-plane" }
secret_refs = {}

[peer_discovery]
provider_id = "control-plane"
settings = {}
secret_refs = {}

[network]
listen_addresses = []
peer_transport = "http"
command_transport = "http"

[network.tls]
enabled = false
```

Exécuter le même binaire en ne modifiant que le chemin du déploiement :

```bash
APPCORE_APPLICATION_MANIFEST=application.toml \
APPCORE_DEPLOYMENT_MANIFEST=deployment.cluster.toml \
cargo run
```

Le Runtime compose maintenant l'enregistrement au control plane, la discovery,
la coordination, la sync, les service leases, la supervision et le shutdown.
Le code métier n'importe aucun de ces crates.

## Ce qu'un test doit démontrer

Charger les manifests standalone et cluster avec `ManifestApplicationHost`,
puis vérifier :

```rust
assert_eq!(standalone.application_manifest(), cluster.application_manifest());
assert_eq!(
    cluster.runtime_manifest().expect("runtime manifest").mode(),
    appcore_bin::application::RuntimeMode::Cluster,
);

let report = cluster
    .probe_services(std::time::Duration::from_secs(2))
    .expect("cluster service probe");
assert!(report.control_plane_started);
assert!(report.discovery_ready);
assert!(report.service_lease_active);
```

Toujours appeler `shutdown()` sur les deux hosts dans le test.

## Limite de production

Ce profil basé sur des fichiers convient à la conformité locale, pas à une
recommandation générale de production. Plusieurs processus exigent un système
de fichiers partagé dont le verrouillage, le renommage atomique, la sync des
répertoires et la cohérence des caches sont certifiés. La production exige
aussi un transport peer authentifié, TLS à la frontière du déploiement, des
secrets opérés, des preuves de backup/recovery et des limites de capacité.

Pour les Cores uniquement sortants, évaluer le profil Gateway `mesh-relay`
documenté plutôt que d'exposer des ports Core privés. Il conserve les contrôles
d'identité Peer RPC, d'expiration, de nonce, de body hash et d'anti-replay.

Retour à l'[index des exemples](./).
