---
title: Modelo de segurança
sidebar_position: 9
---

# Modelo de segurança

Falhas de segurança no AppCore quase sempre começam quando uma fronteira fica confusa: secret dentro de manifest, retry aceito duas vezes, request Peer RPC reaproveitado com outro body, ou update aceito só porque o path parece confiável.

Segurança no AppCore é um conjunto de fronteiras: manifests versionados, tokens assinados, secret references, replay protection, payloads limitados, arquivos privados, DNT e diagnostics redigidos.

Tokens são assinados, não cifrados. Não coloque secrets em manifests, URLs, logs ou debug output.

Replay é tratado em camadas: idempotency key para commands, sequência/checkpoint para sync, nonces para Peer RPC, `jti` single-use para gateway e build/version checks para updates.

DNT autentica contexto e cifra payload. Peer RPC valida tenant, cluster, core, protocolo, expiry, nonce, hash e token bound. Gateway valida conexão e mesh request. Update valida policy, assinatura, checksum e health gate.

## Limitations

- AppCore não fornece OAuth.
- Não fornece TLS termination universal para todos os deployments.
- Não opera vault gerenciado de produção.
- Hardware-backed keys não são garantia da linha 1.0 RC.
- Autorização de domínio pertence à aplicação.
- Um host comprometido pode atacar arquivos locais fora do processo AppCore.

Próximo: [providers](/pt/architecture/providers).
