---
title: Bootstrap and deployment composition
sidebar_position: 3
---

# Bootstrap and deployment composition

The SDK prepares application behavior; it does not provide a Runtime process
host or CLI. Process composition belongs to the deployment.

## Local context and preparation

`App::new` constructs validated canonical V1 manifests in memory.
`appcore_sdk::run` creates that context and invokes a closure; it does not read
manifest files or start listeners, storage, sync or cluster services.
Explicit manifests replace defaults through validated SDK methods.

`App::prepare` registers application behavior and returns `PreparedApplication`.
Core registries and callbacks are owned by the prepared value. With `api`,
queries are registered into a frozen router; with `scheduler`, tasks are
collected into a bounded registry. Preparation is not service startup.

## Validate before starting services

A deployment that loads files must bound reads before allocation, validate
UTF-8 and versioned schemas, and ensure application/deployment identities agree.
A 1 MiB file budget with a `Take(limit + 1)` reader is a useful explicit
deployment policy, not an automatic SDK filesystem guarantee. Never infer or
convert removed unversioned inputs; rejected removed contracts use
`NO MORE SUPPORTED PLEASE UPDATE`.

Resolve provider descriptors, secret references and installation bindings
before opening services. Reject unknown providers and insufficient guarantees
without fallback. Application configuration consumes validated
`DeploymentContext`; infrastructure composition stays outside business hooks.

## Connect the prepared application

The deployment chooses listeners, authentication, payload budgets, token and
idempotency TTLs, sync/cluster policies and Supervisor configuration. Merely
declaring a provider ID in a manifest does not instantiate its implementation.

Compose a shared `CapabilityCatalog` for application HTTP, direct invocation
and Peer RPC where those paths are enabled. Enforce declaration, invocation
mode, idempotency, operational write policy and leadership before handlers.
Create local capability registrations only for real handlers. The SDK does
not automatically wire this catalog into every transport.

## Startup and shutdown

Register selected managed services with the Supervisor, declare dependencies,
and prove readiness with bounded probes. Deployment owns signals, process
restart and update activation/rollback. Shutdown is cooperative; quarantine
does not safely kill arbitrary Rust threads. Test real startup, degraded mode
and shutdown independently of preparation tests.

HTTP routing generations are opt-in primitives: [coordinated reload](./reload)
does not watch manifests or change listener addresses automatically.

## Evidence and limits

SDK consumer tests prove manifests, registration and dispatch within their
tested scope, not a production cluster or a hidden host. External deployments
must supply service-manager, network, recovery and resource evidence. No
provider inference, silent fallback or compatibility parser is implied.

Continue with [storage](/architecture/storage).
