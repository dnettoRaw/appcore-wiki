---
title: appcore-transport
sidebar_position: 4
---

# appcore-transport

:::info Published package
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.0) · [source](https://github.com/dnettoRaw/app-core-public/tree/main/crates/appcore-transport)

Optional prerelease **`1.1.0-alpha.1`** adds the owned pooled client and
per-exchange deadline API: [crates.io](https://crates.io/crates/appcore-transport/1.1.0-alpha.1) ·
[docs.rs](https://docs.rs/crate/appcore-transport/1.1.0-alpha.1) ·
[public source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-transport).
:::

## Crate-owned guide and examples

The public repository maintains the detailed [guide](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-transport/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-transport/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/app-core-public/blob/main/crates/appcore-transport/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** shared bounded HTTP and TLS client mechanics.

**Internal dependencies:** none.

**Versioning:** independent SemVer. The crate can be consumed without any
other AppCore package.

**Primary API:** `HttpScheme`, `HttpTarget`, `HttpRequest`, `HttpHeader`,
`HttpClient`, `HttpExchangeConfig`, `HttpTimeouts`, `HttpPoolConfig`,
`HttpClientConfig`, `HttpResponse`, `CancellationToken`, `TransportError`,
`send`, response parsing and bounded gzip encode/decode.

Own and clone one `HttpClient` to share a bounded pool keyed by scheme, host
and port. Connect/pool admission, read and write deadlines are independent.
Only fully framed and parsed responses are reusable; truncation, malformed
framing, timeout, cancellation, `Connection: close` and close-delimited bodies
discard the socket. The existing free `send` function remains a one-shot V1
adapter and continues to send `Connection: close`.

Use it inside infrastructure adapters that need the same size, timeout,
cancellation and TLS mechanics. Consumers still own authentication and policy.
Do not turn it into a general web framework or add business endpoints.

Request/response `Debug` output contains body lengths, not body bytes. Known
credential headers are redacted even if a caller used the non-sensitive header
constructor.

**Maturity:** stable infrastructure surface.
