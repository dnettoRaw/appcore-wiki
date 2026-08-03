---
title: Modelo de segurança
sidebar_position: 9
---

# Modelo de segurança

Segurança no AppCore é um conjunto de fronteiras: manifests versionados, tokens assinados, secret references, replay protection, payloads limitados, arquivos privados, DNT e diagnostics redigidos.

Tokens são assinados, não cifrados. Não coloque secrets em manifests, URLs, logs ou debug output.

Replay é tratado em camadas: idempotency key para commands, sequência/checkpoint para sync, nonces para Peer RPC, `jti` single-use para gateway e build/version checks para updates.

DNT autentica contexto e cifra payload. Peer RPC valida tenant, cluster, core, protocolo, expiry, nonce, hash e token bound. Gateway valida conexão e mesh request. Update valida policy, assinatura, checksum e health gate.

Não objetivos: OAuth, TLS termination universal, vault gerenciado, hardware-backed keys na linha 1.0 RC, autorização de domínio e defesa contra host comprometido.

Próximo: [providers](/pt/architecture/providers).

