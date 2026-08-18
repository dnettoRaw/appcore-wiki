---
title: appcore-types
sidebar_position: 2
---

# appcore-types

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-types/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-types/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-types)
:::


**Responsabilidade:** identificadores validados, identity e trace compartilhados
pelos contratos.

**Dependências AppCore diretas:** `appcore-contracts`.

**API principal:** IDs de application, node, tenant, cluster, Core, instance,
command, event, query, state e capability; `RuntimeIdentity`, `CoreIdentity`,
policies/status de versão, `TraceContext`, `RuntimeError`,
`RuntimeResult`.

Use esses tipos em vez de strings não validadas nas fronteiras. Não coloque
estado de implementação, I/O ou comportamento de provider aqui.

**Maturidade:** superfície fundamental RC estável.
