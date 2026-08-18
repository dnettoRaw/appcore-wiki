---
title: 4. Standalone to Cluster
sidebar_position: 4
---

# 4. Standalone to Cluster

The intermediate architecture test is simple: keep `application.toml` and
`src/main.rs` unchanged, then select cluster infrastructure with a second
Deployment Manifest.

## Add a cluster deployment

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

Run the same executable with only the deployment path changed:

```bash
APPCORE_APPLICATION_MANIFEST=application.toml \
APPCORE_DEPLOYMENT_MANIFEST=deployment.cluster.toml \
cargo run
```

The Runtime now composes control-plane registration, discovery, coordination,
sync, service leases, supervision, and shutdown. Business code does not import
those crates.

## What to prove in a test

Load the standalone and cluster manifests with `ManifestApplicationHost`, then
assert:

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

Always call `shutdown()` on both hosts in the test.

## Production boundary

This file-backed profile is suitable for local conformance, not a blanket
production recommendation. Multiple processes require a shared filesystem
with certified locking, atomic rename, directory sync, and cache-coherence
semantics. Production also requires authenticated peer transport, TLS at the
deployment boundary, operated secrets, backup/recovery evidence, and capacity
limits.

For outbound-only Cores, evaluate the documented Gateway `mesh-relay` profile
instead of exposing private Core ports. It still preserves Peer RPC identity,
expiry, nonce, body-hash, and replay checks.

Return to the [examples index](./).
