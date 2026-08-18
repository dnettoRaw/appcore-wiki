---
title: appcore-security
sidebar_position: 9
---

# appcore-security

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-security/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-security/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-security)
:::


**Responsabilidade:** contratos reutilizáveis de autenticação, token, segredo e
policy.

**Dependências AppCore diretas:** `appcore-core`, `appcore-dnt`.

**API principal:** provider HashToken, claims, factory/validator de command
token, request hash, `SecurityError`; referências, resolvers, stores, bytes
zerados, file keyring, metadata/rotação, contrato Vault, peer credentials,
adapter de key provider DNT, traits de autenticação e policy.

Use para autenticação de infraestrutura e indireção de segredo. Tokens são
assinados, não criptografados. Não coloque autorização de domínio, OAuth,
inbound TLS ou vault gerenciado aqui.

A RC 1.0 não possui provider TPM ou hardware-backed. O ADR 0005 registra uma
proposta aditiva para 1.1, com fallback explícito e evidência em hardware real;
o Runtime atual não alega proteção por hardware.

**Maturidade:** contratos RC estáveis; produção depende do backend de segredo e
controles do deployment.
