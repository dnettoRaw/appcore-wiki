---
title: Future Roadmap
description: Published prereleases, planned components, and AppCore research.
sidebar_position: 1
slug: /roadmap/
---

# Future Roadmap

:::caution Future components
This roadmap separates prereleases and conceptual components from the current
public crate catalog. Alpha, Beta, or RC entries remain opt-in and their
individual pages state whether they are published; planned and research
entries should not be used as dependencies.
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
| [appcore-ai](/crates/appcore-ai) | Beta | Published `0.1.0-beta.5` for bounded model routing, local or remote inference, resource governance, provenance, security and observable execution. |
| [appcore-filemaker](/crates/appcore-filemaker) | Beta | Published `0.1.0-beta.6` deterministic compiler for declarative documents, vector canvases, and bounded datasets. |
| [appcore-ui](/crates/appcore-ui) | Beta | `0.1.0-beta.1` (crates.io). UI surface boundary for HTML/TypeScript pages, native Rust-rendered views, window lifecycle, events, visual state and future page building. |
| [appcore-filemaker-ai](/crates/appcore-filemaker-ai) | Beta | Published `0.1.0-beta.5` optional bounded tool bridge; AI remains outside the deterministic compiler. |
| [appcore-filemaker-cli](/crates/appcore-filemaker-cli) | Beta | Published `0.1.0-beta.5` bounded process adapter for compilation, diagnostics, and explicit export. |

| [appcore-transfer](/crates/appcore-transfer) | Beta | `0.1.0-beta.1` — crates.io. Resumable transfer of immutable opaque objects from multiple authorized peers, with verified blocks, quotas and bounded concurrency; separate from mesh routing. |

## RC

| Component | Status | Boundary |
| --- | --- | --- |
| [appcore-log](/crates/appcore-log) | RC | Published `1.0.0-rc.3` bounded structured logging pipeline for Runtime components and SDK applications. |
| [appcore-sdk](/crates/appcore-sdk) | RC | Published `1.0.2-rc` manifest-first application facade replacing the retired `appcore-bin`. |

## Alpha

| Component | Status | Boundary |
| --- | --- | --- |
| [appcore-sync-sqlite](/crates/appcore-sync-sqlite) | Alpha | Published `0.1.0-alpha.7` optional persistence for Runtime-owned sync state. |

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
| `appcore-mcu` | Planned | Lightweight authenticated microcontroller integration with bounded messages and capabilities; optional `no_std` firmware profile, with application-owned drivers. |
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

## MCU and Mesh Transfer

MCU remains planned; its name, API, supported board and release date are provisional. `appcore-transfer` is already published as `0.1.0-beta.1`. Remaining hardware and mesh qualification does not make the crate a future component.

### Microcontroller Integration

`appcore-mcu` would let constrained devices participate through identity,
authentication, declared capabilities, bounded commands/events and explicit
availability. Evaluate a lightweight `no_std` firmware library separately from
the host adapter. Drivers, HAL, sensors, actuators and device behavior belong
to application firmware or hardware adapters. A MCU is not automatically a
complete Runtime Core. Coordinate with `appcore-device` to avoid overlapping
ownership of host device access.

Implementation stages:

1. Select a pilot board, define RAM/flash/connectivity budgets and review the
   versioned contract, provisioning, authorization and replay semantics.
2. Implement the bounded codec and host adapter; test invalid frames,
   saturation, reconnection, cancellation and host shutdown.
3. Validate boot, power loss and recovery on real hardware, then document
   measured limits and basic/intermediate examples in English, Portuguese and
   French before expanding to other targets.

### Multi-Peer Transfer

[appcore-transfer](/crates/appcore-transfer) already provides verified immutable blocks, durable resume, bounded multi-source scheduling and optional existing signed Peer RPC V2 integration. Discovery, mesh routing and relays retain their owners; BitTorrent compatibility, public DHT and anonymous discovery are outside its contract.

Remaining qualification and consumer work:

1. Measure throughput, RAM and traffic on real shared networks against a single source; qualify physical mesh and relays.
2. Exercise real partitions, power loss and sustained workloads on deployment hardware, retaining recovery evidence.
3. Validate optional update/snapshot consumers while preserving authenticity, compatibility, health gates and rollback.
4. Add MCU delivery only after a bounded host/device contract and real-device evidence. A valid object hash does not authorize firmware installation.

### Joint Validation

After the host adapter and multi-source transfer work independently, validate a
host/gateway receiving blocks from peers and delivering bounded parts to a MCU.
Direct MCU block serving needs separate memory, storage, energy and connectivity
evidence. Firmware installation additionally requires a reviewed bootloader,
authenticity, compatibility, health and rollback contract.

Both tracks preserve the three-artifact model, explicit deployment composition, optional providers and versioned contracts. MCU needs implementation and release evidence before entering the active catalog. Transfer is already an active beta; stable promotion requires its own reviewed qualification evidence.

## Promotion Rules

- Future components do not enter the stable crate graph.
- Planned plus absent crate is valid.
- Planned plus present crate requires review and does not promote itself.
- Stable plus absent crate is an error.
- Slugs should be preserved when a component matures.
- No future page should include install commands, invented versions or release dates.
