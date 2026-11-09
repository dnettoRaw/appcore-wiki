---
title: appcore-transfer
sidebar_position: 29
---

# Transferência limitada e verificada

A beta `0.1.0-beta.1` transfere objetos opacos imutáveis de fontes explicitamente aprovadas. Os descritores devem vir de uma aplicação ou deployment confiável. Integridade SHA-256 não autentica uma release.

## Recuperação e limites

É necessária uma raiz privada existente: Unix 0700 do proprietário, ou ACL Windows exclusiva do proprietário. O armazenamento mantém lock exclusivo entre processos. Blocos verificados sobrevivem ao reinício; corrupção e versões desconhecidas falham de forma fechada. Temporários órfãos reconhecidos são removidos sob lock. TTL remove apenas objetos incompletos. A retenção dos objetos completos pertence ao deployment.

Default: object 64 MiB, block 64 KiB, store 256 MiB, 16,384 files. Hard maxima: object 256 MiB, block 1 MiB, 4,096 blocks, 65,536 files, 16 sources, 8 workers, 32 attempts/block. Assembly needs space for both blocks and complete content. Descriptor JSON is bounded to 1 MiB. Each worker retains at most one block; descriptor and inventory are bounded. Local filesystem operations require deployment-owned I/O bounds.

## Transporte e responsabilidades

Ative peer-rpc para usar PeerBlockSource e TransferDispatcher pelos streams Peer RPC V2 assinados existentes. O repositório deve autorizar tenant, cluster, origem, destino e objeto. Configure timeouts de I/O dentro do prazo cooperativo da transferência. Providers devem respeitar cancelamento; todos os workers são aguardados. Descoberta e relays pertencem ao deployment; Sync controla replicação e Update autenticidade, ativação e rollback.

Windows cross-compilation is checked; native Windows recovery and physical mesh performance remain release qualification work. MCU remains planned. No installation or artifact activation occurs here.

## Crate-owned examples

[Source guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-transfer/wiki/guide.pt.md) · [Basic](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-transfer/wiki/examples/basic.pt.md) · [Intermediate](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-transfer/wiki/examples/intermediate.pt.md)

## Pacote publicado

[`appcore-transfer 0.1.0-beta.1`](https://crates.io/crates/appcore-transfer/0.1.0-beta.1) · [docs.rs](https://docs.rs/appcore-transfer/0.1.0-beta.1) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-transfer).

## Prerelease independente — 2026-10-14

`0.1.0-beta.2`: alterações próprias.

[crates.io](https://crates.io/crates/appcore-transfer/0.1.0-beta.2) · [docs.rs](https://docs.rs/appcore-transfer/0.1.0-beta.2)

## Disponibilidade HA negociada — 1.0.0-rc.3

Esta coorte RC alinha os tipos distribuídos partilhados entre Sync, Peer RPC, control
plane, Gateway, Transfer, SQLite e SDK. `peer.availability.v1` seleciona resultados
autenticados e estruturados sem mudar os formatos V1. Busy não executa a closure nem
confirma trabalho. Rejeição, pendência, transporte e confirmação durável são distintos;
os retries preservam a identidade idempotente. A composição comprova a conclusão da
closure, o fencing e a confirmação exigida da réplica. Não implica migração de
instalações, deployment ou certificação de falha física de energia.

Consulte o [guia de disponibilidade](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-peer-rpc/wiki/guide.pt.md).
