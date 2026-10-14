---
title: appcore-ui — Beta
sidebar_position: 24
---

# appcore-ui

:::info Public beta
`appcore-ui 0.1.0-beta.2` is available on crates.io. Rendering currently supports macOS.
:::

## Independent public beta

`appcore-ui 0.1.0-beta.2` renders native pages defined in Rust and local web
pages built from HTML/TypeScript. Its current
platform backend is macOS; other platforms remain future work. The broader UI
roadmap does not imply implemented APIs.

The module owns windows, rendering, actions and the Runtime bridge. Applications
own layouts, schemas and business behavior. Deployment selects backend and
principal/capability authorization and owns startup, event pumping and shutdown.
The SDK prepares registrations; it does not start a hidden UI host or executor.

## Native and web pages

`UiNativePageV1` declares validated text/buttons with fixed frames. The optional
`native-macos` backend calls system controls directly. Window and action queues
are bounded; activations do not bypass Runtime authorization.

`UiWebBundle` contains immutable application-built HTML, JavaScript, CSS, images
and fonts, with explicit paths/MIME. Limits are 512 resources, 2 MiB each and
16 MiB retained source bytes. They do not bound total platform engine memory.
The optional `web-macos` backend uses the system web component without bundling
an engine. It serves a random per-window local origin with CSP/nosniff,
nonpersistent storage and no foreign navigation, frames, popups or network.
System bindings are optional and isolated; the default crate does not include them.

## Runtime bridge and recovery

`attach_surface` is explicit before loading. The native caller/origin is verified;
page JSON cannot select principal or tenant. Mandatory authorization and a declared
catalog protect commands, queries and subscriptions. Commands preserve existing
Runtime idempotency and event ownership. UI V1 is independent of manifests/peer
versions; unsupported versions return `NO MORE SUPPORTED PLEASE UPDATE`.

The typed TypeScript client has no additional runtime library. Requests, messages,
subscriptions and retained queues have limits, deadlines and cooperative cancellation.
Backpressure and event loss are visible. Offline invalidates subscriptions;
reconnect creates a fresh window/surface and queries current state. Close rejects
pending promises and releases the surface. Cancellation does not roll back effects.
The deployment pump requires nonblocking authorization/backends or an explicit
bounded blocking boundary; no worker/executor is hidden in the renderer.

## Evidence and scope

Real native and web windows were inspected. Native action, DOM update, rejected
foreign navigation/inline script and clean close were verified. A SDK fixture
executed query, command, subscription and replay: one effect, one Runtime event,
one notification; forged authority and foreign surface IDs were rejected.

An external independent source consumer reused an existing screen and CSS with
synthetic data. Refresh executed a second query; native close exited 0 with
`status_queries=2 pending_requests=0 retained_windows=0`. This qualifies isolated
integration, not production login/data or a complete application migration.
Rust/TypeScript tests cover validation, authorization, saturation, cancellation,
deadlines, reconnect, queue loss and shutdown.

Initial limits: macOS rendering, fixed native layout and ephemeral notifications.
Page builder, AI generation, native 3D and MCU remain future directions. This beta does not qualify production application deployment. New UI schemas have no previous persisted
version to convert; incompatible evolution requires an explicit version and
migration/rollback review, while current manifests remain intact.

## Interactive examples and native functions

The native profile now includes editable text, checkbox, dropdown, slider and determinate progress, besides text/buttons. `elements::{text,button,input,toggle,select,slider,progress}` are pure Rust constructors; validate the enclosing page. `UiNativeWindow::{set_label,set_value,set_enabled,value}` update/read existing controls with typed validation and page/label budgets, without changing action bindings or granting authorization. Dropdowns admit 1–64 unique nonempty labels; user input is bounded when read, not a guarantee about all memory inside system editing controls.

The gallery uses Editing → Review → Applied, revision checks, locked controls and scripted typed commands. No AI model is connected. The runner has deterministic physics, collision/score/restart/pause. The 3D example uses direct system WebGL, perspective/depth and six Lorenz trajectories, RK4 integration, 24,576 bounded point samples, orbit/zoom, trail isolation, pause and single-step controls; it is not a Rust-native 3D engine.

All four examples were rendered and interacted with in real macOS windows; closing each exited 0 with zero retained windows. The component/AI proposal is a roadmap, not an implemented tool protocol.

## Installation and documentation

```toml
[dependencies]
appcore-ui = { version = "=0.1.0-beta.2", features = ["web-macos"] }
```

The published package includes the compiled bridge client: running `web_bridge` does not require Node or an npm build. The npm steps in source development guides only rebuild that client. Run the Cargo examples from the extracted crate or the Runtime source workspace.

[crates.io](https://crates.io/crates/appcore-ui/0.1.0-beta.2) · [API](https://docs.rs/appcore-ui/0.1.0-beta.2/appcore_ui/)

- [Guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/guide.en.md)
- [Basic](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/examples/basic.en.md)
- [Intermediate](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/examples/intermediate.en.md)

## Input responsiveness

The pump services pending run-loop work even under native input load, and bridge work before/after native dispatch. Native draining stops when the activation queue is full; consume `pending_activations` with `next_activation` after pumping. System tracking/callbacks can exceed the cooperative drain budget. The web view accepts the first physical click when activating an inactive window; this changes focus behavior, not authorization. Physical click checks received ten of ten actions in native and web examples, plus one click when switching windows.

## Independent prerelease — 2026-10-14

`0.1.0-beta.2`: dependency metadata alignment.

[crates.io](https://crates.io/crates/appcore-ui/0.1.0-beta.2) · [docs.rs](https://docs.rs/appcore-ui/0.1.0-beta.2)
