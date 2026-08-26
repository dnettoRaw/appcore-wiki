---
title: appcore-peer-rpc
sidebar_position: 17
---

# appcore-peer-rpc

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-peer-rpc/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-peer-rpc/1.0.0) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-peer-rpc)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-peer-rpc/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** authenticated direct peer client, HTTP host, validation and
replay protection.

**Internal dependencies:** core, distributed contracts, security and transport.

**Primary API:** token issuer/authenticator/dispatcher traits and HashToken or
static implementations; in-memory/file nonce stores; validation config,
validator and signing/payload hashes; retry/client config and transport trait;
pooled and standard one-shot transports; HTTP state and host.

Use `PooledPeerRpcTransport` to reuse bounded per-origin connections.
`StdPeerRpcTransport` preserves the V1 one-shot `Connection: close` behavior.

Use it only after tenant, cluster, source, target, protocol, expiry, nonce and
payload integrity can be established. `AllowPeerAuthenticator` is for tests,
not remote production.

Peer request, response, outbound and HTTP DTO `Debug` output reports payload
lengths and omits opaque bytes, credentials, nonce/idempotency values and remote
error details.

**Maturity:** stable peer protocol V1 surface.

## Bounded V2 codec

`PeerRpcChunkEncoder` and `PeerRpcChunkAssembler` process an explicitly selected
V2 stream one bounded chunk at a time. Defaults cap decoded chunks at 64 KiB,
encoded chunks at 96 KiB, the aggregate at 64 MiB and chunk count at 1,024.
Encoded bytes use a canonical base64 JSON string, never an integer array.
Sequence, exact decoded size, chunk and aggregate SHA-256, deadline,
cancellation and quota after gzip decompression fail closed. A failed commit
never exposes the partial sink as complete.

`PeerRpcStreamRegistry` owns partial sessions under exact session and decoded
byte quotas. It writes request chunks to exclusive files in an existing
owner-only spool directory, dispatches only verified commits and returns
responses through explicit bounded pull frames. Error, cancellation, expiry
and completion release the partial file and reservation. Snapshots expose
active sessions, reserved bytes, saturation and cleanup counters.
Unix validates the effective owner and `0700`/`0600` directory/file modes.
Windows rejects reparse points and every allow ACE outside the current process
owner SID. Unsupported platforms fail closed during registry construction.

Enable the signed HTTP routes only with
`PeerRpcHttpHost::with_v2_stream_registry`; the default host remains V1-only.
`query_stream_v2` and `command_stream_v2` bind each exact JSON body to a bearer
token and move request/response data one frame at a time. Open admission checks
tenant, cluster, target, trace, deadline, command idempotency and bounded nonce
replay. Ambiguous frames are not retried; best-effort cancellation is backed by
authoritative deadline cleanup.

Clean-source release certification at `8d26cc3` passed for an incompressible
64 MiB payload with 1,024 chunks, an 87,660-byte largest JSON frame,
1.092-second p99 and 366,432 KiB whole-suite peak RSS. This API does not
negotiate a transport. `/v1/peer/*` parses only V1 and never infers V2. V2 is
published only on the opt-in `2.0.0-alpha.1` line.
