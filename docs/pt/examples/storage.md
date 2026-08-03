---
title: Storage
sidebar_position: 4
---

# Storage

## Introdução

This example focuses on journal-first write and snapshot projection.

## Padrão mínimo

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

## Fluxo

```mermaid
flowchart TD
    W[Accepted write] --> J[Bounded journal/log]
    J --> C[Checksum or hash-chain validation]
    C --> S[Snapshot/projection]
    J --> B[Backup bundle]
    B --> V[Restore verifier]
    V --> R[Recovered runtime state]
```

## O que copiar

- Stable command names.
- Idempotency handling.
- Tenant context.
- Explicit provider or transport assumptions.

## O que não copiar cegamente

- In-memory persistence for production.
- Missing authorization policy.
- Unbounded payloads.
- Direct coupling between API routes and storage records.

## Páginas relacionadas

- [Tutorials](/pt/tutorials/todo-app)
- [Concepts](/pt/concepts/commands)
- [Operations](/pt/operations/deployment)
