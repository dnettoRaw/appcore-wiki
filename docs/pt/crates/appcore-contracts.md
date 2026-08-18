---
title: appcore-contracts
sidebar_position: 1
---

# appcore-contracts

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-contracts/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-contracts/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-contracts)
:::


**Responsabilidade:** manifests e policies estáveis, independentes de
implementação.

**Dependências AppCore diretas:** Nenhuma.

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
