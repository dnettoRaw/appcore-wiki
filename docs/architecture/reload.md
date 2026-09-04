---
title: Coordinated Reload
sidebar_position: 8
---

# Coordinated Reload

AppCore 1.0 starts one immutable HTTP routing configuration and remains the
stable package. The `appcore-api 1.0.2-rc` candidate introduces an opt-in routing-generation
transaction for configuration changes that keep the listener address.

## Transaction

1. Compose a candidate Router with a strictly newer `u64` generation.
2. Require the same enabled listener address and bounded non-zero deadlines.
3. Call the candidate `/v1/health` before activation.
4. Close old admission and atomically select the candidate for new requests.
5. Call `/v1/health` again through the selected candidate.
6. Drain the old in-flight count before releasing its resources.

An accepted request holds its generation until completion. It is never moved
or retried by the reload layer. Post-switch health or drain failure restores
the previous generation, closes failed-generation admission and performs a
bounded cleanup drain. Concurrent or stale reload attempts fail explicitly.
A failed generation with requests occupies the single retiring slot. Another
reload fails until the final permit releases that Router, so repeated timeouts
cannot accumulate detached routing generations.
Cancelling the reload future after the switch synchronously restores the
previous generation and moves any admitted candidate requests into that same
bounded retiring slot.

## Ownership and limits

`appcore-api` owns routing generations. `appcore-bin` registers the owner as
the existing `http` managed service. The existing Supervisor remains the only
lifecycle owner and process restart stays external.

Health and drain deadlines are capped at 60 seconds. Snapshots expose only
generation, in-flight, transaction, success, failure and rollback counters.
They never contain payloads, tokens, request IDs, tenant IDs or addresses.
`generation_snapshot` exposes one active and at most one retiring generation,
including admission and in-flight counts, without retaining a history.

Leadership is not derived from a routing generation. Commands still validate
their current service lease and fencing contract, so reload cannot create two
valid leadership epochs.

## Address and certificate rotation

Changing the listener address requires the composition root to bind and health
check a second listener generation before external routing changes. It is not
silently treated as an in-place routing reload. Inbound certificates remain a
deployment-sidecar boundary under AC-024; rotating a sidecar certificate does
not reinterpret Runtime manifests.

Use the [inbound TLS sidecar profile](./inbound-tls-sidecar) for certificate
rotation. It keeps the Runtime listener stable and adds no second Runtime
routing path.

The current `appcore-api 1.0.2-rc` candidate implements same-listener routing,
and `appcore-bin` composes it as the existing supervised HTTP service over a
pre-bound TCP listener. Address-changing composition, a coordinated
configuration trigger and external cross-platform certification remain post-GA
work. This API is not available from the stable `1.0.0` package.

## Evidence

The real-socket regression keeps a generation 1 request active, switches the
same listener, serves a generation 2 request and then completes generation 1.
The clean local AC-022 run measured 750 ns p99 routing overhead, 26.7 us reload
p99 at 41,488 reloads/s and 42 ns snapshot p99. All 256 reloads committed with
zero failure, rollback or residual in-flight observations. Linux and Windows
CI remain the authoritative platform evidence.
