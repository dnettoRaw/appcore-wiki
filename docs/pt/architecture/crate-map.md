---
title: Mapa de crates
sidebar_position: 12
---

# Mapa de crates

Quando um runtime cresce, os limites entre crates precisam explicar a arquitetura. No AppCore eles seguem ownership: contratos (`appcore-contracts`, `appcore-types`), lifecycle (`appcore-supervisor`), core (`appcore-core`), serviços (`appcore-api`, `appcore-storage`, `appcore-security`, `appcore-scheduler`, `appcore-sync`), distribuição (`appcore-control-plane`, `appcore-peer-rpc`, `appcore-gateway`), composição (`appcore-provider`, `appcore-update`) e host (`appcore-bin`).

`appcore-bin` é o único composition root concreto para aplicações. Contratos não dependem de implementações, e código de negócio não deve importar módulos privados do host.

## Limitations

- Este mapa explica ownership, não substitui referência de API.
- Crates de tooling/certificação podem não ser superfície estável de aplicação.
- Módulos internos podem mudar mesmo quando manifests e facade pública continuam compatíveis.
