---
title: Contributing
sidebar_position: 6
---

# Contributing

## Introduction

This page covers issue scope, design review, tests, docs, security boundaries, and API compatibility.

## Working rules

- Keep public contracts in contract crates.
- Keep infrastructure providers out of application business code.
- Preserve manifest compatibility or introduce a versioned migration.
- Prefer explicit failure to silent fallback.
- Add tests for bounded inputs and recovery paths.

## Local gates

```bash
make doctor
make docs.check
make verify
make ci
make release.local
```

## Internal flow

```mermaid
sequenceDiagram
    participant Host
    participant Contracts
    participant Providers
    participant Supervisor
    participant App
    Host->>Contracts: validate application and deployment manifests
    Host->>Providers: resolve explicit provider plan
    Providers-->>Host: validated infrastructure handles
    Host->>Supervisor: register runtime services
    Host->>App: pass validated deployment context
    Supervisor-->>Host: readiness or degraded state
```

## Review questions

- Does this change alter a stable manifest field?
- Does it introduce unbounded input, queue, retry, file, or response handling?
- Are secrets represented as references?
- Are debug outputs redacted?
- Can the behavior be tested without an external production provider?

## Related pages

- [Workspace](/en/development/workspace)
- [Testing](/en/development/testing)
- [Release Process](/en/development/release-process)
