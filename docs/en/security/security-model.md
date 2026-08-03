---
title: Security Model
sidebar_position: 9
---

# Security Model

AppCore security is a set of boundaries rather than a single feature. The runtime validates manifests, scopes tokens, redacts diagnostics, protects replay windows, bounds files and payloads, and keeps secret material out of manifests.

## Tokens are signed, not encrypted

Runtime tokens use signed claims. A token proves integrity and issuer policy; it should not be treated as an encrypted container. Secrets and private keys must not be placed in manifests, URLs, logs, or debug output.

Gateway and Peer RPC credentials are scoped to `peer` purpose. Gateway connection credentials are short-lived, single-use, and bound to connection identity. Peer RPC request tokens can be bound to the hash of an envelope.

## Replay protection

Replay protection appears in multiple layers:

- command idempotency keys prevent repeated client commands;
- sync sequences and checkpoints prevent duplicate replication records;
- peer RPC nonces prevent reused envelopes;
- gateway connection `jti` values prevent reused connection credentials;
- update build IDs and version checks prevent reactivating the active artifact under a new path.

## Filesystem security

Runtime file formats reject symlinks and path traversal where the provider owns the boundary. Several stores use owner-only directories or files on Unix, explicit locks, bounded reads, temporary files, atomic replacement, and parent-directory sync.

This does not make an unsafe host safe. If the operating system account is compromised, local runtime files can be attacked outside AppCore's process.

## DNT protection

DNT protects portable files by authenticating the header and encrypting payload plus encrypted metadata. Because the header includes application ID, optional tenant ID, content type, codec ID, key ID, and schema version, an envelope cannot be moved across those contexts without failing verification.

## Update protection

Update security combines descriptor policy, cryptographic authenticity, artifact byte limits, SHA-256 integrity, immutable staging, activation health checks, and rollback.

Unsigned local artifacts are not a production default. They require a dedicated compile-time feature and strict local file validation.

## Explicit non-goals

AppCore does not provide OAuth, production TLS termination, a managed vault, hardware-backed keys in the 1.0 release-candidate line, domain authorization policy, or protection against a compromised host operating system.

Continue with [providers](/en/architecture/providers).

