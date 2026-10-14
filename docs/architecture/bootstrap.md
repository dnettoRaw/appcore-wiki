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

## Operation identity and completion recovery

Unpublished source contract: key uniqueness is store-wide; `command-v2:` binds the application ID, command name and length-delimited payload with SHA-256. Node, request ID, issue time and trace are transport metadata, so retries may change them. A different application or operation using the same key fails with `IdempotencyConflict`. Payload-only fingerprints fail at controller dispatch with `NO MORE SUPPORTED PLEASE UPDATE`; they are never converted. Drain and reconcile the old installation, archive its store and explicitly select a fresh store before upgrade. Roll back with the original executable and original store; never mix them.

At most 64 executing/recoverable keyed completions are admitted, each serialized result at most 1 MiB (64 MiB retained body ceiling). A receipt write failure retains the outcome in the shared controller buffer. An identical retry persists the same receipt and publishes events once in this process, without rerunning the handler, including an ambiguous write that already reached the store. `recoverable_command_completions` counts retained outcomes. A full buffer rejects before handler execution. An oversized outcome leaves a durable pending reservation requiring reconciliation.

File startup and TTL compaction preserve `Pending`; only resolved receipts expire. After process loss, dispatch never guesses the external effect. A trusted application/deployment reconciles authoritative effect evidence and calls `recover_pending_command` with the original operation and its bounded result. Active, resolved, missing or mismatched reservations are rejected. Ordinary failed handlers release their reservation when store removal succeeds.

Application effects, receipt persistence and event publication are separate boundaries. A crash after a receipt write but before event publication can still lose publication. The bounded EventBus and its optional operational journal are not a transactional application outbox. For durable exactly-once business recovery, commit the effect, authoritative result and stable event IDs in an application-owned transaction/outbox and deduplicate consumers. Do not delete a pending reservation or generate a new key to bypass uncertainty.

## Async admission

Unpublished source fix: runtime execution admission and model-load single-flight waiting suspend through executor-neutral `futures_timer::Delay`; neither uses a Condvar wait on the async router thread. Queue count/priority/selected-slot bounds remain enforced. Dropping a queued future releases both its queue entry and any selected slot. Cancellation and deadlines are rechecked at the configured poll interval (model loads: 10 ms); no mutex is held across await. The timer owns a shared helper thread, not one worker per request. Backend implementations still own cooperative cancellation and must offload their own blocking work. A single-thread regression runs pending backend load with both saturated execution and competing model-load admission.
