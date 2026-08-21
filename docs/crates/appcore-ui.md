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

`appcore-ui` is the planned crate for declaring, generating and executing UI
surfaces in AppCore. It is not just a component library. Its boundary is the
runtime contract around pages, windows, views, events, actions, visual state and
the bridge from interface intent to AppCore commands, queries and capabilities.

## Planned Surface Model

The central concepts are expected to be:

- `UiSurface`: the runtime-owned interface surface;
- `UiDocument`: a structured description of pages, views, bindings and actions;
- `Window`, `Page`, `View` and `Viewport`: lifecycle and rendering boundaries;
- event, action, state and lifecycle contracts;
- bindings from UI actions to AppCore commands;
- bindings from AppCore queries to visual state;
- capability-controlled access to runtime and application behavior.

The planned flow is deliberately explicit:

```text
UI Event -> Action -> AppCore Command
AppCore Query -> Visual State -> UI
```

## Web Surface

The web-like path should support pages maintained or generated from HTML and
TypeScript, similar to a Tauri-style application surface. This is the practical
path for settings screens, admin panels, desktop-style business UI, internal
tools, dashboards and pages generated from structured descriptions.

No final WebView, browser engine or bundler contract is promised yet.

## Native Surface

The native path should leave room for Rust-rendered pages backed by a graphics
engine. This is for interfaces that need more than a document-style UI:

- 2D or 3D render windows;
- games;
- technical tools;
- real-time dashboards;
- custom editors;
- business screens with custom visual systems;
- generated UI that should become native rather than HTML.

`appcore-ui` should define the boundary around surfaces, events and state. It
should not pretend to be a full graphics engine by itself. If rendering becomes
large enough, a future rendering crate can own backend-specific details.

## Page Builder Direction

A future page builder can sit on top of `appcore-ui` with pre-coded items that
assemble into pages. The builder should generate structured UI artifacts rather
than hiding behavior in ad hoc templates.

AI may help generate a `UiDocument`, propose layouts, or create draft pages, but
`appcore-ai` should not own the UI system. The UI contract remains separate so a
page can be produced by a human builder, static templates, code generation or
AI-assisted tools.

## Limits

- `appcore-ui` is not published yet.
- It must not add install instructions until release.
- It should not promise a final WebView or graphics backend.
- It should not mix UI generation with AI, search or agent ownership.
- Its public API, rendering contracts, dependency boundary, version, MSRV and
  executable examples remain provisional until release.
