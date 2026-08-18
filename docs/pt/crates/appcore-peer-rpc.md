---
title: appcore-peer-rpc
sidebar_position: 16
---

# appcore-peer-rpc

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-peer-rpc/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-peer-rpc/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-peer-rpc)
:::


**Responsabilidade:** client peer autenticado, host HTTP, validação e replay
protection.

**Dependências AppCore diretas:** `appcore-core`, `appcore-distributed-contracts`, `appcore-security`, `appcore-transport`.

**API principal:** traits de token issuer/authenticator/dispatcher e
implementações HashToken/static; nonce stores memória/arquivo; config,
validator e hashes; retry/client config e transport trait; transporte standard;
HTTP state e host.

Use somente quando tenant, cluster, source, target, protocolo, expiry, nonce e
integridade podem ser provados. `AllowPeerAuthenticator` é somente teste.

O `Debug` dos DTOs peer request, response, outbound e HTTP mostra tamanhos e
omite bytes opacos, credenciais, valores de nonce/idempotencia e detalhes de
erro remoto.

**Maturidade:** superfície peer V1 RC estável.
