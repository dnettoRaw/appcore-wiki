---
title: appcore-sdk
sidebar_position: 28
---

# appcore-sdk

Stable documentation ID: **ACR-028**.

`appcore-sdk` is the application-facing facade. It gives business code a small
manifest-first surface while specialized crates continue to own storage,
scheduling, synchronization, AI, document generation, and deployment
integration.

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
