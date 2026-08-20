---
title: appcore-security
sidebar_position: 10
---

# appcore-security

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-security/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-security/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-security)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-security/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-security/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-security/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** contratos reutilizáveis de autenticação, token, segredo e
policy.

**Dependências internas:** `appcore-core`, `appcore-dnt`.

**API principal:** provider HashToken, claims, factory/validator de command
token, request hash, `SecurityError`; referências, resolvers, stores, bytes
zerados, file keyring, metadata/rotação, contrato Vault, peer credentials,
adapter de key provider DNT, traits de autenticação e policy.

Use para autenticação de infraestrutura e indireção de segredo. Tokens são
assinados, não criptografados. Não coloque autorização de domínio, OAuth,
inbound TLS ou vault gerenciado aqui.

`HashTokenProvider::from_secret`, `with_secret` e `with_material` retornam
`SecurityResult` e aplicam as mesmas invariantes mínimas de secret e salts.
`compute_request_hash` produz um SHA-256 com marcador `v2:` sobre campos
separados por domínio, com tamanho e presença de opcionais explícitos. Hashes
anteriores sem versão são rejeitados; emissores e validadores devem ser
atualizados juntos.

O AppCore 1.0 não possui provider TPM ou hardware-backed. O ADR 0005 registra uma
proposta aditiva para 1.1, com fallback explícito e evidência em hardware real;
o Runtime atual não alega proteção por hardware.

**Maturidade:** contratos estáveis; produção depende do backend de segredo e
controles do deployment.
