---
title: Crate Map
sidebar_position: 12
---

# Crate Map

When a runtime grows, crate boundaries either explain the architecture or hide it. AppCore crates are split by ownership boundary, not by convenience.

The current source catalog contains 28 active public crates. Every public crate
owns independent SemVer even when several release numbers happen to align;
source presence does not by itself claim registry publication. The complete
reference and permanent IDs are in the [crate catalog](/crates/).

| Layer | Crates | Why it exists |
| --- | --- | --- |
| Standalone foundations | `appcore-args`, `appcore-supervisor`, `appcore-transport` | independently versioned reusable components with no AppCore dependencies |
| Contracts | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` | manifests, validated identities, wire contracts, and provider composition contracts |
| Runtime | `appcore-core`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-log`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-api`, `appcore-update`, `appcore-ai`, `appcore-filemaker` | Runtime behavior and infrastructure, each with an explicit ownership boundary |
| Integrations | `appcore-gateway`, `appcore-provider-vercel-neon`, `appcore-sync-sqlite` | externally operated or optional infrastructure integrations |
| Adapters | `appcore-filemaker-ai`, `appcore-filemaker-cli` | optional model and process adapters around the deterministic FileMaker core |
| Facade | `appcore-sdk` | application contracts and opt-in namespaces without implicit host composition |
| Tools | `appcore-dev`, `runtime-console`, certification tools | development, operator, and release evidence workflows; not public Runtime crates |

All public packages are independently versioned. Standalone foundations also
remain reusable without AppCore dependencies. In particular,
`appcore-supervisor` manages in-process services without depending on command
dispatch, and `appcore-args` parses CLI input without executing Runtime
commands.

The architecture rule is acyclic dependency direction. Contracts do not depend on implementations. Business code depends on the public application facade, not private host modules.

## How should you read this map?

Start with `appcore-sdk` for business code, then move to an owning crate only
when its lower-level contract is required. A deployment process composes
providers, services, listeners, and process lifecycle explicitly; the SDK does
not hide that host inside the application library.

If a crate owns a wire format or manifest type, treat it as compatibility-sensitive. If it owns a provider implementation, treat it as deployment-sensitive. If it owns business registration facades, treat it as application-facing.

## Fuzz testing

The source repository has a private central fuzz workspace with 12 bounded
targets for untrusted text and byte boundaries. It covers CLI parsing,
manifests and identifiers, HTTP framing, distributed messages, DNT containers,
API requests, security tokens, storage paths, sync envelopes, Peer RPC,
gateway DTOs and update descriptors. `appcore-ai` and `appcore-filemaker` keep
specialized fuzz workspaces next to their implementations.

Run `appcore-dev test fuzz` to compile every fuzz workspace with its locked
dependencies. The same test gate uses the committed lockfiles for the external
SDK and three-artifact consumers, and fails instead of updating a fixture
silently. A target rejects inputs larger than 256 KiB before invoking the
boundary. Stateful lifecycle code remains in deterministic, property,
concurrency and integration tests because random bytes do not represent those
invariants usefully.

## Limitations

- This map explains ownership boundaries; use the [crate catalog](/crates/)
  for APIs, limits, maturity, and registry links.
- Crate names can expose experimental or certification tooling that is not part of the stable application surface.
- Internal modules may change even when public manifest and application contracts remain compatible.
