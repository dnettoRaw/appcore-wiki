---
title: appcore-transport
sidebar_position: 4
---

# appcore-transport

:::info Published package
Published **`1.0.1-rc.8`** · current Runtime workspace **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-transport)
:::

## Crate-owned guide and examples

The Runtime repository maintains the detailed [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-transport/wiki/guide.en.md), [basic example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-transport/wiki/examples/basic.en.md), and [intermediate example](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-transport/wiki/examples/intermediate.en.md). The wiki summarizes the public boundary; API and executable details live beside the crate code.

**Responsibility:** shared bounded HTTP and TLS client mechanics.

**Internal dependencies:** none.

**Versioning:** independent SemVer. The crate can be consumed without any
other AppCore package.

**Primary API:** `HttpScheme`, `HttpTarget`, `HttpRequest`, `HttpHeader`,
`HttpClientConfig`, `HttpResponse`, `CancellationToken`, `TransportError`,
`send`, response parsing and bounded gzip encode/decode.

Use it inside infrastructure adapters that need the same size, timeout,
cancellation and TLS mechanics. Consumers still own authentication and policy.
Do not turn it into a general web framework or add business endpoints.

Request/response `Debug` output contains body lengths, not body bytes. Known
credential headers are redacted even if a caller used the non-sensitive header
constructor.

**Maturity:** stable infrastructure RC surface.
