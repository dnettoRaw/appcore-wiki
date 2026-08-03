---
title: Fencing
sidebar_position: 8
---

# Fencing

## Introduction

Fencing prevents stale leaders or workers from committing after authority has moved.

## Decision rules

- Make the tenant boundary explicit.
- Prefer validated typed IDs from shared runtime types over raw strings at boundaries.
- Record accepted work before observable state changes.
- Bound payloads, files, queues, retries, and timeouts.
- Make degraded state visible instead of hiding it behind retries.

## Internal flow

```mermaid
flowchart TD
    CP[Control plane] --> P[Presence and discovery]
    CP --> L[Service-scoped leases]
    L --> F[Fencing token]
    F --> W[Protected write]
    P --> RPC[Peer RPC]
    RPC --> SYNC[Sync receiver]
    SYNC --> C[Checkpoint]
```

## Examples

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

## What beginners usually miss

- A retry is part of the contract, not an exception.
- A projection is not the source of durable truth.
- A provider name is infrastructure, not product meaning.
- Leadership without fencing is not enough.

## Limitations

This concept explains the runtime boundary. Application-specific invariants, schemas, user-facing behavior, and external provider operation remain outside the concept itself.

## Related pages

- [Commands](/en/concepts/commands)
- [Storage Model](/en/architecture/storage-model)
- [Security Overview](/en/security/overview)
