---
title: appcore-types
sidebar_position: 3
---

# appcore-types

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-types/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-types/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-types)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-types/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** identificadores validados, identity e trace compartilhados
pelos contratos.

**Dependências internas:** `appcore-contracts`.

**API principal:** IDs de application, node, tenant, cluster, Core, instance,
command, event, query, state e capability; `RuntimeIdentity`, `CoreIdentity`,
policies/status de versão, `TraceContext`, `RuntimeError`,
`RuntimeResult`.

Use esses tipos em vez de strings não validadas nas fronteiras. Não coloque
estado de implementação, I/O ou comportamento de provider aqui.

**Maturidade:** superfície fundamental estável.
