---
title: Carte des crates
sidebar_position: 12
---

# Carte des crates

Les crates sont séparées par ownership : contrats (`appcore-contracts`, `appcore-types`), lifecycle (`appcore-supervisor`), core (`appcore-core`), services (`appcore-api`, `appcore-storage`, `appcore-security`, `appcore-scheduler`, `appcore-sync`), distribué (`appcore-control-plane`, `appcore-peer-rpc`, `appcore-gateway`), composition (`appcore-provider`, `appcore-update`) et host (`appcore-bin`).

`appcore-bin` est le seul composition root concret pour les applications. Les contrats ne dépendent pas des implémentations, et le code métier ne doit pas importer de modules privés du host.

