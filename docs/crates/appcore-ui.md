---
title: appcore-ui — Coming soon
sidebar_position: 24
---

# appcore-ui

:::caution Coming soon
`appcore-ui` is under development and **has not been published yet**. It is not
currently available on crates.io or docs.rs and should not be used as a
dependency.
:::

`appcore-ui` is the planned UI and page-builder crate for AppCore. This page
reserves its place in the crate catalog while the implementation and public
contract are being finalized.

The intended direction is to support pages that can be maintained and generated
from simple HTML and TypeScript flows, similar to a Tauri-style application
surface, while also leaving room for native Rust-rendered pages backed by a
graphics engine.

That native rendering path is meant for interfaces that need more than a
document-style UI, including 3D render windows, games, business screens, custom
design systems, and other experiences where the limit is the application
design rather than the page format.

A future page builder is planned on top of this crate, with pre-coded items that
can be assembled into pages. The public API, rendering contracts, dependency
boundary, version, MSRV, installation instructions, and examples will be added
when the crate is ready for release.
