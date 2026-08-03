---
title: Idempotence
sidebar_position: 11
---

# Idempotence

## Introduction

Idempotency records the first accepted result for a stable key so retries do not repeat state changes.

## Règles de décision

- Make the tenant boundary explicit.
- Prefer validated typed IDs from shared runtime types over raw strings at boundaries.
- Record accepted work before observable state changes.
- Bound payloads, files, queues, retries, and timeouts.
- Make degraded state visible instead of hiding it behind retries.

## Flux interne

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Security
    participant Runtime
    participant Journal
    participant Handler
    Client->>API: command + idempotency key
    API->>Security: authenticate and authorize
    API->>Runtime: dispatch validated command
    Runtime->>Journal: record accepted intent
    Runtime->>Handler: execute application handler
    Handler-->>Runtime: events or rejection
    Runtime-->>Client: stable result
```

## Exemples

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

## Ce que les débutants manquent souvent

- A retry is part of the contract, not an exception.
- A projection is not the source of durable truth.
- A provider name is infrastructure, not product meaning.
- Leadership without fencing is not enough.

## Limites

This concept explains the runtime boundary. Application-specific invariants, schemas, user-facing behavior, and external provider operation remain outside the concept itself.

## Pages liées

- [Commands](/fr/concepts/commands)
- [Storage Model](/fr/architecture/storage-model)
- [Security Overview](/fr/security/overview)
