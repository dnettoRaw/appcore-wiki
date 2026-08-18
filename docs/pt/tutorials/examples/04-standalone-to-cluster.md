---
title: 4. De standalone para cluster
sidebar_position: 4
---

# 4. De standalone para cluster

O teste arquitetural intermediário é simples: mantenha `application.toml` e
`src/main.rs` intactos e selecione infraestrutura de cluster num segundo
Deployment Manifest.

## Adicione um deployment de cluster

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

Execute o mesmo binário alterando somente o path do deployment:

```bash
APPCORE_APPLICATION_MANIFEST=application.toml \
APPCORE_DEPLOYMENT_MANIFEST=deployment.cluster.toml \
cargo run
```

O Runtime passa a compor registro no control plane, discovery, coordenação,
sync, service leases, supervision e shutdown. O código de negócio não importa
esses crates.

## O que provar num teste

Carregue os manifests standalone e cluster com `ManifestApplicationHost` e
verifique:

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

Sempre chame `shutdown()` nos dois hosts ao final do teste.

## Fronteira de produção

Este perfil file-backed serve para conformidade local, não como recomendação
genérica de produção. Vários processos exigem filesystem compartilhado com
locking, atomic rename, directory sync e cache coherence certificados.
Produção também exige transporte peer autenticado, TLS no deployment, secrets
operados, evidência de backup/recovery e limites de capacidade.

Para Cores somente outbound, avalie o perfil Gateway `mesh-relay` documentado
em vez de expor portas privadas. Ele ainda preserva identity, expiry, nonce,
body hash e replay protection do Peer RPC.

Volte ao [índice de exemplos](./).
