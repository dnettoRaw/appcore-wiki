---
title: appcore-storage
sidebar_position: 10
---

# appcore-storage

:::info Pacote publicado
Versão **`1.0.1-rc.8`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-storage/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-storage/1.0.1-rc.8) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/ba8cfd5b915a087c28f08e65f6d898868989eeda/crates/appcore-storage)
:::


**Responsabilidade:** contratos genéricos de storage e provider local em
arquivo.

**Dependências AppCore diretas:** `appcore-contracts`, `appcore-dnt`, `appcore-security`, `appcore-types`.

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

**Maturidade:** contratos RC estáveis; provider em arquivo certificado para um
processo local e filesystem com locks/sync/rename adequados.
