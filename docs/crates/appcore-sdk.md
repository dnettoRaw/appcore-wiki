---
title: appcore-sdk — RC
sidebar_position: 28
---

# appcore-sdk

:::info Release candidate
Published and registry-verified **[`1.0.2-rc.3`](https://crates.io/crates/appcore-sdk/1.0.2-rc.3)**, 2026-10-17. Select `=1.0.2-rc.3` explicitly. Versions remain independent; this is a release candidate, not deployment or hardware certification.
:::

Stable documentation ID: **ACR-028**.


`appcore-sdk` is the application-facing facade. It gives business code a small
manifest-first surface while specialized crates continue to own storage,
scheduling, synchronization, AI, document generation, and deployment
integration. It replaces the retired `appcore-bin`; the SDK does not preserve
that crate's host or Runtime CLI.

:::warning Migration from appcore-bin
The final registry release of `appcore-bin` is only a retirement notice. New
applications must depend directly on `appcore-sdk`. Existing applications keep
their manifests and business code, replace `appcore_bin` imports, and let their
deployment executable own providers, listeners, workers, and shutdown.
:::

## Choose it when

- starting an external AppCore application from the three artifacts;
- implementing `Application` and registering commands, events, queries,
  decisions, states, handlers, or tasks;
- using canonical local defaults before supplying explicit V1 manifests;
- opting into capability namespaces without manually composing a Runtime host.

It does not start an implicit network listener, choose providers, resolve
secrets, or own process lifecycle. Deployment composition remains explicit.

## Main contracts

- `run` and `App` provide the smallest validated local context;
- `Application` defines application-owned registration hooks;
- `manifest` reexports the canonical V1 manifest contracts;
- feature-gated namespaces expose API, deployment, scheduler, storage, sync,
  AI, and FileMaker contracts;
- `App::logging` configures the bounded `appcore-log` pipeline.

Start with the [first application tutorial](/tutorials/first-application) and
the crate-owned [English guide](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.en.md),
[Portuguese guide](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.pt.md),
or [French guide](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/guide.fr.md).
Then run the crate-owned [basic example](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/basic.en.md)
and [intermediate example](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-sdk/wiki/examples/intermediate.en.md).

## Independent prerelease — 2026-10-14

`1.0.2-rc.1`: source changes.

[crates.io](https://crates.io/crates/appcore-sdk/1.0.2-rc.1) · [docs.rs](https://docs.rs/appcore-sdk/1.0.2-rc.1)

## 1.0.2-rc.3

Exact dependency pins select the qualified AI security distribution and FileMaker RC where applicable. Public APIs, default features and V1 inputs are unchanged. Select the exact release and refresh the full lockfile explicitly; old exact pins remain immutable. The optional backend uses the registry security distributions documented on the AI page. This does not certify hardware or migrate an external application.
