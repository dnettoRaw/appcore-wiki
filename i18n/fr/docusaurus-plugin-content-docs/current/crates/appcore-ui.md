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

`appcore-ui` est le crate prévu pour déclarer, générer et exécuter des surfaces
UI dans AppCore. Ce n'est pas seulement une bibliothèque de composants. Sa
frontière est le contrat runtime autour des pages, fenêtres, vues, événements,
actions, état visuel et du pont entre intention d'interface et commands,
queries et capabilities AppCore.

## Modèle de surface prévu

Les concepts centraux devraient être :

- `UiSurface` : surface d'interface possédée par le runtime ;
- `UiDocument` : description structurée de pages, vues, bindings et actions ;
- `Window`, `Page`, `View` et `Viewport` : frontières lifecycle et rendu ;
- contrats d'événement, action, état et lifecycle ;
- bindings des actions UI vers les commands AppCore ;
- bindings des queries AppCore vers l'état visuel ;
- accès au comportement runtime et applicatif contrôlé par capabilities.

Le flux prévu est explicite :

```text
UI Event -> Action -> AppCore Command
AppCore Query -> Visual State -> UI
```

## Web Surface

Le chemin web-like doit prendre en charge des pages maintenues ou générées en
HTML et TypeScript, proche d'une surface d'application de style Tauri. C'est le
chemin pratique pour settings, admin, UI métier desktop, outils internes,
dashboards et pages générées à partir de descriptions structurées.

Aucun contrat final de WebView, browser engine ou bundler n'est promis.

## Native Surface

Le chemin natif doit laisser de la place à des pages rendues en Rust avec un
moteur graphique. Il vise les interfaces qui doivent dépasser une UI de type
document :

- fenêtres de rendu 2D ou 3D ;
- jeux ;
- outils techniques ;
- dashboards temps réel ;
- éditeurs personnalisés ;
- écrans métier avec systèmes visuels propres ;
- UI générée qui doit devenir native plutôt que HTML.

`appcore-ui` doit définir la frontière des surfaces, événements et état. Il ne
doit pas prétendre être un moteur graphique complet. Si le rendu devient assez
large, un futur crate de rendu peut posséder les détails de backend.

## Direction Page Builder

Un futur page builder peut s'appuyer sur `appcore-ui`, avec des éléments
pré-codés assemblés en pages. Le builder doit générer des artefacts UI
structurés plutôt que cacher le comportement dans des templates ad hoc.

L'IA peut aider à générer un `UiDocument`, proposer des layouts ou créer des
drafts de pages, mais `appcore-ai` ne doit pas posséder le système UI. Le
contrat UI reste séparé afin qu'une page puisse venir d'un builder humain, de
templates statiques, de codegen ou d'outils assistés par IA.

## Limites

- `appcore-ui` n'est pas encore publié.
- Il ne doit pas inclure d'instructions d'installation avant release.
- Il ne doit pas promettre un WebView ou backend graphique final.
- Il ne doit pas mélanger génération UI avec ownership IA, search ou agent.
- API publique, contrats de rendu, frontière des dépendances, version, MSRV et
  exemples exécutables restent provisoires jusqu'à release.
