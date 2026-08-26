---
title: Security Model
sidebar_position: 9
---

# Security Model

Security failures in AppCore usually begin as boundary confusion: a manifest accidentally contains a secret, a retry is accepted twice, a peer request is replayed with a different body, or an update artifact is trusted because the path looked familiar.

AppCore security is a set of boundaries rather than a single feature. The runtime validates manifests, scopes tokens, redacts diagnostics, protects replay windows, bounds files and payloads, and keeps secret material out of manifests.

## Why are signed tokens not secret containers?

Runtime tokens use signed claims. A token proves integrity and issuer policy; it should not be treated as an encrypted container. Secrets and private keys must not be placed in manifests, URLs, logs, or debug output.

Gateway and Peer RPC credentials are scoped to `peer` purpose. Gateway connection credentials are short-lived, single-use, and bound to connection identity. Peer RPC request tokens can be bound to the hash of an envelope.

Request-bound hashes use the `v2:` canonical SHA-256 format with domain
separation, length framing, and explicit optional-field presence. Earlier
unversioned hashes are rejected, so token issuers and validators must be
upgraded together. Runtime HTTP command/query authentication fails closed by
default; only the explicit local-test constructor disables it, and
`/v1/health` remains public by contract.

## Where is replay blocked?

Replay protection appears in multiple layers:

- command idempotency keys prevent repeated client commands;
- sync sequences and checkpoints prevent duplicate replication records;
- peer RPC nonces prevent reused envelopes;
- gateway connection `jti` values prevent reused connection credentials;
- update build IDs and version checks prevent reactivating the active artifact under a new path.

## What does filesystem security cover?

Runtime file formats reject symlinks and path traversal where the provider owns the boundary. Several stores use owner-only directories or files on Unix, explicit locks, bounded reads, temporary files, atomic replacement, and parent-directory sync.

This does not make an unsafe host safe. If the operating system account is compromised, local runtime files can be attacked outside AppCore's process.

## Why does DNT bind context?

DNT protects portable files by authenticating the header and encrypting payload plus encrypted metadata. Because the header includes application ID, optional tenant ID, content type, codec ID, key ID, and schema version, an envelope cannot be moved across those contexts without failing verification.

## Why does update security combine policy and bytes?

Update security combines descriptor policy, cryptographic authenticity, artifact byte limits, SHA-256 integrity, immutable staging, activation health checks, and rollback.

Unsigned local artifacts are not a production default. They require a dedicated compile-time feature and strict local file validation.

## Windows DPAPI provider status

AC-009 has accepted `windows-dpapi-user-v1` for the post-1.0 development line.
The 2.0 alpha implementation protects every bounded rotation record with
non-interactive DPAPI user scope: normally the same user on the same computer
is required to decrypt a record. Machine scope is explicitly excluded because
it permits other local users to decrypt. Selection is opt-in and never falls
back to `env-file`, `file-keyring-v1` or machine scope. Keyring CLI operations
must pass `--keyring-provider windows-dpapi-user-v1`; omission selects the
unchanged `file-keyring-v1` behavior.

The persisted root must also be owned by the current user SID, have an
owner-only protected DACL and reject links, junctions and other reparse points.
Backup and restore are deliberately limited to the same user profile and
machine. Rotation, revocation, same-user restore, format separation and
redaction have repository tests, and the complete Runtime test executables
cross-build for Windows. The provider is not certified until the real Windows
multi-user and multi-machine matrix passes; cross-compilation and mocked tests
are not that evidence. Stable 1.0 remains unchanged and updating is explicit.

## Limitations

- AppCore does not provide OAuth.
- It does not provide production TLS termination for every deployment shape.
- It does not provide a managed production vault.
- Hardware-backed keys are not part of the stable 1.0 contract.
- AppCore does not define domain authorization policy.
- It cannot protect local files from a compromised host operating system account.

Continue with [providers](/architecture/providers).
