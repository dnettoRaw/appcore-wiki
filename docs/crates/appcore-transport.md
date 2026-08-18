---
title: appcore-transport
sidebar_position: 3
---

# appcore-transport

:::info Published package
Version **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-transport/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-transport/1.0.1-rc.8) · [source](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-transport)
:::


**Responsibility:** shared bounded HTTP and TLS client mechanics.

**Direct AppCore dependencies:** None.

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
