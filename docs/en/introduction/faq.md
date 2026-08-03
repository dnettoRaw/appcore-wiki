---
title: FAQ
sidebar_position: 5
---

# FAQ

## Introduction

This page answers fit and scope questions directly so that readers do not treat AppCore as more or less than it is.

## Questions

### Is AppCore a web framework?

No. It has HTTP command/query/status endpoints, but the runtime also owns manifests, lifecycle, storage contracts, security, scheduling, sync, peer RPC, control-plane coordination, supervision, and updates.

### What is the recommended application entry point?

New applications implement `appcore_bin::application::Application` and call `run_application`.

### What are the three artifacts?

`application.toml`, `deployment.toml`, and business code. The first is portable and authored by the application. The second is installation-owned and selects providers. Business code receives validated runtime context instead of assembling infrastructure by hand.

### What should not be placed in manifests?

Secrets, private keys, local operator-only values, business payloads, and domain schemas.

### Does AppCore provide consensus?

No. Sync is conservative leader-to-follower replication; distributed operation uses leases, fencing, control-plane discovery, and peer RPC. Multi-master consensus is outside scope.

## Related pages

- [Project Status](/en/introduction/project-status)
- [Manifest Concept](/en/concepts/manifests)
- [Provider Model](/en/concepts/providers)
