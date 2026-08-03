---
title: ILM
sidebar_position: 1
---

# ILM

:::caution Experimental
Experimental, not stable, may change, and has no compatibility guarantee.
:::

## Introduction

This page describes information lifecycle management for retention, compaction, archival, and deletion policy.

## Evaluation criteria

- Does it preserve the three-artifact application model?
- Does it keep provider fallback explicit and fail closed?
- Can it be tested with deterministic fixtures?
- Does it change storage, update, or security contracts?
- Can operators disable it without corrupting stable runtime state?

## Internal flow

```mermaid
flowchart TD
    W[Accepted write] --> J[Bounded journal/log]
    J --> C[Checksum or hash-chain validation]
    C --> S[Snapshot/projection]
    J --> B[Backup bundle]
    B --> V[Restore verifier]
    V --> R[Recovered runtime state]
```

## Prototype shape

```rust
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Command {
    pub tenant_id: String,
    pub idempotency_key: String,
    pub key: String,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Event {
    Recorded { key: String, value: String },
}

#[derive(Default)]
pub struct Service {
    accepted: BTreeMap<String, Event>,
    projection: BTreeMap<String, String>,
}

impl Service {
    pub fn handle(&mut self, command: Command) -> Event {
        if let Some(event) = self.accepted.get(&command.idempotency_key) {
            return event.clone();
        }
        let event = Event::Recorded { key: command.key.clone(), value: command.value.clone() };
        self.projection.insert(command.key, command.value);
        self.accepted.insert(command.idempotency_key, event.clone());
        event
    }
}
```

## Limitations

There is no compatibility promise. Names, crate ownership, persisted formats, provider contracts, and operator workflows may change.

## Related pages

- [Project Status](/en/introduction/project-status)
- [Roadmap](/en/development/roadmap)
- [Security Overview](/en/security/overview)
