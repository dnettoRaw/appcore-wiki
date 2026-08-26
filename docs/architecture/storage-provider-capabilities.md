---
title: Storage Provider Capabilities
sidebar_position: 11
---

# Storage provider capability preflight

The post-1.0 descriptor V1 separates portable requirements from provider
implementation. It has seven closed guarantees: `transactions`, `locking`,
`snapshot`, `streaming`, `online_backup`, `multi_process` and `multi_host`.
One catalog admits at most 32 descriptors.

Deployments opt in through the existing storage provider setting:

```toml
[storage]
provider_id = "file"
settings = { required_capabilities = "snapshot" }
secret_refs = {}
```

The existing application declaration `storage.shared=true` requires
`multi_host`. Unknown, duplicate, unavailable and unsupported requirements fail
before provider startup with typed, redacted errors. There is no provider or
semantic fallback.

The file provider advertises only `snapshot`. Atomic file replacement and an
internal lock are not advertised as transactions, caller-visible locking,
streaming, online backup, multi-process or multi-host guarantees. This
conservative boundary is the prerequisite for SQLite sync and durable scheduler
providers. Business schemas remain application-owned.

This development contract does not change published V1 manifest shapes. Future
incompatible meanings require a distinct descriptor version. Rollback requires
removing opt-in requirements only after independently proving the older host
and selected provider meet the same semantics.

Clean-source release certification at `12cbfc3` executed 16,384 preflights with
p50/p95 of 42 ns, p99 of 83 ns and 10,493,879 operations/s. Unsupported
requirements failed closed; the complete suite remained below its RSS budget.
