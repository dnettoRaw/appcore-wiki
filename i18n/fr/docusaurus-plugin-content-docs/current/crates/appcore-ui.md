---
title: appcore-ui — Bientôt disponible
sidebar_position: 24
---

# appcore-ui

:::caution Bientôt disponible
`appcore-ui` est en cours de développement et **n'est pas encore publié**. Il
n'est actuellement disponible ni sur crates.io ni sur docs.rs et ne doit pas
être utilisé comme dépendance.
:::

`appcore-ui` est le crate prévu pour l'UI et le page builder dans AppCore.
Cette page réserve sa place dans le catalogue pendant la finalisation de
l'implémentation et du contrat public.

L'orientation prévue est de prendre en charge des pages qui peuvent être
maintenues et générées à partir de flux simples en HTML et TypeScript, sur une
surface d'application proche de Tauri, tout en gardant la possibilité de pages
natives en Rust rendues par un moteur graphique.

Ce chemin de rendu natif vise les interfaces qui doivent aller au-delà d'une UI
de type document, notamment les fenêtres de rendu 3D, les jeux, les écrans
métier, les systèmes de design personnalisés et d'autres expériences où la
limite vient de la conception de l'application plutôt que du format de page.

Un futur page builder est prévu au-dessus de ce crate, avec des éléments
pré-codés qui pourront être assemblés en pages. L'API publique, les contrats de
rendu, la frontière des dépendances, la version, le MSRV, les instructions
d'installation et les exemples seront ajoutés lorsque le crate sera prêt à être
publié.
