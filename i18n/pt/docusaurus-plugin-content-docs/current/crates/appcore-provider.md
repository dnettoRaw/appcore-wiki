---
title: appcore-provider
sidebar_position: 19
---

# appcore-provider

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-provider/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-provider/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-provider)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-provider/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** factories, registry, deployment plans, contratos de
coordenação/job e resolução de segredo independentes de implementação.

**Dependências internas:** `appcore-contracts`.

**API principal:** `ProviderRole`, `ProviderContext`, `ProviderFactory`,
`ProviderRegistry`, `DeploymentProviderPlan`, errors/results,
`ResolvedSecret`/`SecretProvider`; coordination schema V2, stores memória/file;
leases de recurso compartilhado com fencing; job spec/lease/completion/provider.

Leases em filesystem usam lock por recurso, arquivo de estado versionado e um
sidecar versionado de high-water epoch. O sidecar é persistido antes de publicar
a lease ativa e sobrevive a release, restart e aquisição interrompida, portanto
um epoch não é reutilizado. O epoch é fencing token apenas
para escritores que o validam antes de gravar. Filesystems compartilhados sem
lock, rename, sync de diretório ou coerência de cache confiáveis não oferecem
proteção forte contra split brain por este adapter sozinho.

Use para compor providers explícitos. Não registre fallback silencioso nem SDK
específico de provider neste crate.

**Maturidade:** superfície de composição estável; jobs distribuídos estão
fora do primeiro perfil 1.0.
