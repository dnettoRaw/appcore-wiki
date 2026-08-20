---
title: appcore-storage
sidebar_position: 11
---

# appcore-storage

:::info Pacote publicado
Publicado **`1.0.1-rc.8`** · workspace atual do Runtime **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-storage/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-storage/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-storage)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-storage/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-storage/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-storage/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** contratos genéricos de storage e provider local em
arquivo.

**Dependências internas:** `appcore-contracts`, `appcore-dnt`,
`appcore-security`, `appcore-types`.

**API principal:** `StorageProvider`, `Repository`, `Migration`, `Transaction`,
health/status/errors, IDs validados, `FileStorageProvider`, manifests de
storage, backup V1, helpers autenticados de storage remoto e stores opcionais
selados por DNT para objetos, snapshots e segredos.

O adapter selado em arquivo escreve DNT normal por padrão e expõe
`DntFileObjectStore::write_object_compact` para snapshots, backups e arquivos
de domínio exportáveis quando o payload for compressível. Escritas compactadas
continuam sendo envelopes DNT comuns sobre o mesmo provider de arquivo; o
contrato do backend de storage não muda.
Leituras seladas derivam o limite do envelope completo de
`SealedStoragePolicy` e rejeitam arquivos grandes demais antes de alocar o
buffer do arquivo.

Use quando aplicação ou serviço precisa do perfil local-first documentado.
Mantenha schemas e tabelas de domínio fora. Transações não suportadas falham.

Housekeeping e traversal de backup são iterativos, limitados e nunca seguem
symlinks ou reparse points do Windows. A listagem usa timestamps persistidos no
manifest do snapshot e só recorre aos metadados de criação/modificação para
backups simples em arquivo. A abertura final usa no-follow da plataforma e é
revalidada sob o lock do processo. O perfil de um processo ainda pressupõe uma
raiz protegida pelo proprietário: a troca maliciosa de um diretório ancestral
por outro processo da mesma conta durante a operação permanece fora desta
boundary portátil.

**Maturidade:** contratos RC estáveis; provider em arquivo certificado para um
processo local e filesystem com locks/sync/rename adequados.
