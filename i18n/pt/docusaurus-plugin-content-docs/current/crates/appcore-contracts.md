---
title: appcore-contracts
sidebar_position: 2
---

# appcore-contracts

:::info Pacote publicado
Publicado **`1.0.1-rc.8`** · workspace atual do Runtime **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-contracts/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-contracts/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-contracts)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-contracts/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** manifests e policies estáveis, independentes de
implementação.

**Dependências internas:** nenhuma.

**API principal:** `ApplicationManifestV1`, `DeploymentManifestV1`,
`DeploymentManifestBuilder`, `RuntimeManifestV1`, `RuntimeMode`,
`RuntimeOperationalMode`, policies de capability/storage/leadership/job/
scheduler/health/update/module, configuração de provider/network/TLS/volume/
environment e `ContractError`.

Use para parse, build e validação de contratos portáteis. Preserve nomes
serializados e significados. Não adicione transport, filesystem, processo ou
negócio.

**Maturidade:** superfície RC estável. Mudanças V1 devem ser aditivas e
compatíveis na linha 1.0.
