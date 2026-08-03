---
title: Mapa de crates
sidebar_position: 12
---

# Mapa de crates

Crates são separados por ownership: contratos (`appcore-contracts`, `appcore-types`), lifecycle (`appcore-supervisor`), core (`appcore-core`), serviços (`appcore-api`, `appcore-storage`, `appcore-security`, `appcore-scheduler`, `appcore-sync`), distribuição (`appcore-control-plane`, `appcore-peer-rpc`, `appcore-gateway`), composição (`appcore-provider`, `appcore-update`) e host (`appcore-bin`).

`appcore-bin` é o único composition root concreto para aplicações. Contratos não dependem de implementações, e código de negócio não deve importar módulos privados do host.

