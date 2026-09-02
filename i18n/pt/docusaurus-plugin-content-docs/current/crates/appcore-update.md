---
title: appcore-update
sidebar_position: 21
---

# appcore-update

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-update/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-update/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-update)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-update/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-update/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-update/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** seleção, autenticidade, stage, ativação, health gate e
rollback de artefato opaco.

**Dependências internas:** contracts e provider.

**API principal:** artifact descriptor/signing payload; verifier,
unsigned-local protegido por feature/Ed25519, trust policy/key status; update request/provider e file
factory; staged artifact, activation receipt/store; coordinator,
preparation/outcome, health check e fault injection.

Use para binários ou artefatos opacos. O Runtime valida identidade, versão,
protocolo, checksum e trust, sem entender código ou schema.

Leituras de arquivo verificam tamanho antes de alocar, usam scratch fixo de 16
KiB mais um byte sentinela não retido e rejeitam componente final não regular.
A ativação revalida tamanho e SHA-256 do staged e cria hard link para um path de
build imutável. Um path existente só é reutilizado quando os bytes correspondem
exatamente ao descriptor; nunca é substituído. O no-follow atômico do
componente final existe em Unix. Outras plataformas mantêm checks de metadata,
mas dependem da fronteira do filesystem do deployment contra races de reparse.

**Maturidade:** lifecycle estável; supply chain remoto exige assinatura,
provenance e trust roots.
