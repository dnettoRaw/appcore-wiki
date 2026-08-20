---
title: appcore-peer-rpc
sidebar_position: 17
---

# appcore-peer-rpc

:::info Pacote publicado
Publicado **`1.0.1-rc.8`** · workspace atual do Runtime **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-peer-rpc/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-peer-rpc/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-peer-rpc)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-peer-rpc/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-peer-rpc/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-peer-rpc/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** client peer autenticado, host HTTP, validação e replay
protection.

**Dependências internas:** core, distributed contracts, security e transport.

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
