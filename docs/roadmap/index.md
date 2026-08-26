---
title: Future Roadmap
description: Planned and research AppCore components that are not part of the 22 stable crates.
sidebar_position: 1
slug: /roadmap/
---

# Future Roadmap

:::caution Future components
This roadmap separates prereleases and conceptual components from the 22
stable public crates. Entries marked Alpha or Beta are published but remain
opt-in; planned and research entries should not be used as dependencies.
:::

AppCore keeps stable Runtime documentation separate from future design work.
The entries below reserve names, boundaries and intent so planned crates can be
discussed without presenting them as available APIs.

Status promotion is manual. A component may keep its slug when it moves from
Research to Planned, In Design, Alpha, Beta, RC or Stable, but no promotion is
automatic just because a crate appears in the Runtime repository.

## Beta

| Component | Status | Boundary |
| --- | --- | --- |
| [appcore-ai](/crates/appcore-ai) | Beta | Published `0.1.0-beta.3` for bounded model routing, local or remote inference, resource governance, provenance, security and observable execution. |

## Alpha

| Component | Status | Boundary |
| --- | --- | --- |
| [appcore-sync-sqlite](/crates/appcore-sync-sqlite) | Alpha | Published `0.1.0-alpha.2` optional persistence for Runtime-owned sync state, against the coordinated `2.0.0-alpha.1` Runtime contracts. |

## In Design

| Component | Status | Boundary |
| --- | --- | --- |
| [appcore-ui](/crates/appcore-ui) | In Design | UI surface boundary for HTML/TypeScript pages, native Rust-rendered views, window lifecycle, events, visual state and future page building. |

## High Priority

| Component | Status | Boundary |
| --- | --- | --- |
| `appcore-test` | Planned | Deterministic test harness with `TestAppCore`, fake clock, storage, transport, peers, providers, AI, device/UI surfaces, fault injection and network simulation. |
| `appcore-jobs` | Planned | Durable job lifecycle: Created, Queued, Running, Completed, Failed or Retry. Scheduler decides when and where; jobs own persistence and lifecycle. |
| `appcore-search` | Planned | Local-first full-text, metadata, filters and ranking boundary, with vector and hybrid retrieval possible later without promising a built-in vector database. |
| `appcore-automation` | Planned | Deterministic `Event -> Condition -> Action -> Command` workflow with optional AI assistance and future visual editing. |
| `appcore-plugin` | Planned | Extensibility for providers, AI backends, UI components, device adapters and integrations, starting with Rust static composition rather than a promised dynamic ABI. |

## Platform Expansion

| Component | Status | Boundary |
| --- | --- | --- |
| `appcore-media` | Planned | Audio, video, capture, playback, encode/decode and streaming boundary for UI, AI and applications without committing to codecs. |
| `appcore-device` | Planned | Capability-controlled USB, Bluetooth, serial, HID, sensors, camera, microphone, display and GPU/NPU discovery boundary. |
| `appcore-agent` | Planned | Goal, planning, tools, memory and action orchestration built on top of AI instead of mixed into inference. |
| `appcore-data` | Planned | `Source -> Decode -> Validate -> Transform -> Batch/Stream -> Sink`; not a default ORM or dataframe layer. |
| `appcore-cache` | Planned | Small bounded cache with TTL, eviction and metrics; not a Redis competitor. |
| `appcore-runtime-sdk` | Planned | Ergonomic facade such as `app.ai()`, `app.ui()` and `app.storage()` over existing runtime surfaces, not a second implementation. |

## Under Evaluation

| Component | Status | Boundary |
| --- | --- | --- |
| `appcore-events` | Research | Event bus candidate only if analysis proves event responsibility is dispersed enough to justify a separate crate. |
| `appcore-config` | Research | Defaults, file, environment, CLI and deployment layering candidate; `appcore-args` remains the CLI owner. |
| `appcore-secrets` | Research | Possible split from security only if secret resolution, rotation, scoping and audit need an independent owner. |
| `appcore-sandbox` | Research | Isolation boundary candidate; no sandboxing guarantee is claimed before implementation and threat model. |

## Future Research

| Component | Status | Boundary |
| --- | --- | --- |
| `appcore-browser` | Research | Controlled browser and web automation research, not a commitment to become a browser engine. |
| `appcore-spatial` | Research | Possible UI evolution toward scene, XR, AR or VR concepts. |
| `appcore-sim` | Research | Deterministic simulation of clusters, devices, networks and pressure, distinct from `appcore-test`. |
| `appcore-cloud` | Research | Deployment and orchestration abstraction research, not a cloud provider. |

## Promotion Rules

- Future components do not enter the stable crate graph.
- Planned plus absent crate is valid.
- Planned plus present crate requires review and does not promote itself.
- Stable plus absent crate is an error.
- Slugs should be preserved when a component matures.
- No future page should include install commands, invented versions or release dates.
