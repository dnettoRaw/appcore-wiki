---
title: Crate Catalog
sidebar_position: 0
slug: /crates/
---

# Crate Catalog

AppCore-Runtime contains 28 active public crates. Each package owns independent
SemVer and one explicit layer. A release in one crate does not force unrelated
packages to change version.

Start application code with [`appcore-sdk`](/crates/appcore-sdk). Depend on a
lower-level crate only when the application or integration needs that contract
directly.

## Stable documentation links

Every crate has a permanent ID from ACR-001 through ACR-028. Use those URLs in
READMEs, issues, release notes, and external documentation:

```text
https://wiki.appcore.dnettoraw.com/crates/id/acr-028
```

The ID redirects to the current page even if its slug changes. IDs are never
reused. See the complete [stable ID registry](./registry).

## Layers

| Layer | Responsibility | Crates |
|---|---|---|
| Standalone | Generic bounded libraries without AppCore dependencies | `appcore-args`, `appcore-supervisor`, `appcore-transport` |
| Contract | Versioned manifests, identities, wire formats, and provider contracts | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` |
| Runtime | Modular lifecycle, security, data, coordination, observability, AI, and document behavior | `appcore-core`, `appcore-api`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-log`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-update`, `appcore-ai`, `appcore-filemaker` |
| Integration | Explicit adapters for external or optional infrastructure | `appcore-gateway`, `appcore-provider-vercel-neon`, `appcore-sync-sqlite` |
| Adapter | Optional developer/model interfaces around a deterministic core | `appcore-filemaker-ai`, `appcore-filemaker-cli` |
| Facade | Application-facing composition boundary | `appcore-sdk` |

The graph remains acyclic: contracts do not depend on implementations, and
standalone crates do not depend on AppCore. Pre-release crates remain explicit
and do not silently enter stable deployments.

## Documentation ownership

Each crate README must answer:

- what the crate owns and deliberately does not own;
- when a consumer should select it;
- its main public contracts and smallest useful example;
- important resource, security, and failure limits;
- how to run focused tests and examples;
- where its stable wiki ID leads for supplemental architecture guidance.

Crate-owned guides and localized examples live with source under
`crates/<name>/wiki`. Runtime-wide relationships and operator guidance live in
this public wiki.

Historical pages such as `appcore-bin`, `appcore-filemaker-yaml`, and
`appcore-ui` are not active crate entries. They remain only where architecture
history or future work still needs them.
