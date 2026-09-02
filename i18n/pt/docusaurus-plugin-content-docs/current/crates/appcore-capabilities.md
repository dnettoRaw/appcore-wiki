---
title: appcore-capabilities
sidebar_position: 16
---

# appcore-capabilities

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-capabilities/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-capabilities/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-capabilities)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-capabilities/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** catalogar descritores compostos, registrar handlers
locais e resolver providers locais ou remotos compatíveis.

**Dependências internas:** contracts, core e distributed contracts.

**API principal:** request/response/error, traits local handler e remote
invoker, catálogo e contexto de enforcement, local provider, registry, provider
selection, resolution policy, selection trait/default, resolver e invoker peer
RPC baseado no contrato distribuído.

Use IDs genéricos e requisitos explícitos. O resolver considera health, mode,
liderança e policy; não interpreta semântica de produto.

Use `CapabilityCatalog` quando a composition root precisar resolver e autorizar
descritores do manifesto antes do dispatch. Use `CapabilityRegistry` apenas
quando houver um handler local real. Catálogo e resolver compartilham
enforcement de request, modo de escrita e liderança.

O resolver padrão percorre referências emprestadas de peer e descriptor,
retém somente o primeiro fallback compatível e clona apenas o provider
selecionado. A compatibilidade usa o descriptor já encontrado em vez de
percorrer uma cópia de todos os nomes anunciados. Uma
`CapabilitySelectionPolicy`
customizada continua recebendo o slice owned completo exigido pelo trait
público estável.

**Maturidade:** perfil de roteamento estável.
