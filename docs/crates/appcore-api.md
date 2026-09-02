---
title: appcore-api
sidebar_position: 9
---

# appcore-api

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-api/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-api/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-api)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** Runtime HTTP command/query/status host and transport DTOs.

**Internal dependencies:** `appcore-core`, `appcore-security` and
`appcore-supervisor`.

**Primary API:** `CommandRequest`/`CommandResponse`,
`QueryRequest`/`QueryResponse`, validation errors, `CommandEndpoint`,
`QueryEndpoint`, `ApiRouter`, generic `ApiRequest`/`ApiResponse`,
`RuntimeHttpHost`, `HttpApiConfig`, static status information, application
command/query capability policy, token verification and sync-log view.

Use it to expose Runtime-owned routes and register application query behavior.
Do not add product REST resources or business schemas. New application hosting
normally reaches it through `appcore-bin`.

Application queries are authorized by the composed capability policy before
the application router runs. Runtime-owned status queries remain outside the
application capability catalog.

On the current 1.0 line, Runtime hosts freeze `ApiRouter` query
registration after bootstrap. Router snapshots share immutable endpoints via
`Arc`; direct facade, HTTP and peer RPC dispatch release the host-state mutex
before calling an endpoint. Independent queries therefore execute
concurrently, and late registration fails with `router_frozen`.

The built-in `runtime.audit` query limits each response to at most 1,000 newest
items. It captures shared record and entry snapshots under short locks and
materializes only that page after releasing them, instead of deep-cloning both
complete 10,000-item queues. Selecting 1,000 of 10,000 measured 2.06 us p50 and
11.88 MiB peak RSS, versus 4.16 ms and 20.33 MiB for the old full copies.

`runtime.events` follows the same snapshot boundary, caps the newest page at
1,000 and continues to omit opaque payloads from its unchanged response.
Selecting 1,000 of 10,000 events measured 2.39 us p50 and 8.48 MiB peak RSS,
versus 2.09 ms and 14.59 MiB for cloning the complete history.

The configured payload bound applies to the complete HTTP body before Axum
deserializes JSON. Protected routes accept exactly one well-formed bearer
`Authorization` header; duplicates fail closed.

Structured query validation streams JSON into a bounded counting writer. It
therefore enforces the exact serialized-byte limit without retaining an encoded
`Vec<u8>`, while the public `payload_bytes()` method remains compatible. The
HTTP path validates once before the request crosses into blocking dispatch.

The router owns one shared immutable `RuntimeStaticInfo`; cloning request state
does not copy its peer lists, DNS seeds, paths or identity strings. Blocking
dispatch takes ownership of command/query requests. Query audit keeps only the
bounded query ID and name while the payload is in flight.

`HttpCommandAuth::default()` requires authentication and fails closed until a
token verifier is configured. Only `insecure_local_for_testing()` explicitly
disables command/query authentication for controlled local tests. `/v1/health`
remains intentionally public. Rejected command authorization is audited with
normalized metadata and never records credentials, payloads or idempotency
keys.

## `1.0.2-rc`: coordinated routing reload

The `1.0.2-rc` source candidate adds the opt-in
`ReloadableRuntimeHttpHost`. A candidate must use a strictly newer generation
on the same bound address and pass `/v1/health` before and after one atomic
routing switch. Requests already accepted retain their original Router until
completion; the old generation drains under a deadline. Failed health or drain
restores the prior generation and closes failed-generation admission.

The active pointer is lock-free, deadlines are capped at 60 seconds and the
snapshot contains only generation, in-flight, success, failure and rollback
counters. A composition root may transfer an already bound TCP listener for
bind-before-start validation. Address changes require a separate prepared
listener generation and are not inferred.

This API is source status only. Do not infer that it is available from the
stable `1.0.0` package shown above. See [coordinated reload](/architecture/reload).

**Maturity:** stable strict HTTP V1 surface.
