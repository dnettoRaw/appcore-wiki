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

JSON remains the V2 default. Binary framing requires
`with_v2_binary_codec()` on the host and
`with_stream_codec_v2(PeerRpcStreamCodecV2::Binary)` on the client. Separate
query/command paths require the exact Postcard media type and bind the token to
the exact binary body. Binary bodies never use HTTP gzip; decoded bounds,
optional chunk gzip and integrity hashes remain unchanged. Missing or
mismatched binary support is terminal and never falls back to JSON.

## Typed V2 rejections

The `appcore-peer-rpc` 1.5 candidate consumes `PeerRpcWireErrorV2` from the
explicit `appcore-distributed-contracts` 2.0 prerelease endpoints. Its code
fixes the phase and retryability; retry delay is bounded to
300 seconds, correlation to 128 bytes and the protocol-owned redacted message
to 256 bytes. The client rejects contradictory known metadata. Unknown codes
discard their remote message/hint and become one observable, terminal
`unknown` result.

Frozen V1 responses keep their existing JSON shape. The client maps only exact
host codes to `PeerRpcError::RemoteRejected`; only exact endpoint/replay
capacity rejections enter the existing bounded retry loop. No substring or
free-form message controls retry. V2 frame acknowledgement ambiguity still
forbids automatic frame retry.

:::warning Update together, keep V1 explicit
Update caller and target before selecting the V2 endpoint. Stable V1 remains
supported for legacy deployments and is never upgraded, converted or disabled
automatically.
:::

Clean-source release certification at `6f3bc38` measured 25% fewer body bytes,
93% lower codec p99 and a 14% smaller bounded codec buffer for binary frames
from 64 KiB through 4 MiB. The 1 KiB case improved 38%/65%/18%; whole-suite
peak RSS was 306,448 KiB. `/v1/peer/*` parses only V1 and never infers V2. The
binary codec remains development-only until Linux/Windows evidence is attached.
