---
title: appcore-ui — Em breve
sidebar_position: 24
---

# appcore-ui

:::caution Em breve
O `appcore-ui` está em desenvolvimento e **ainda não foi publicado**. No
momento, ele não está disponível no crates.io nem no docs.rs e não deve ser
usado como dependência.
:::

O `appcore-ui` é o crate planejado para declarar, gerar e executar superfícies
de UI no AppCore. Ele não é apenas uma biblioteca de componentes. Sua fronteira
é o contrato de runtime ao redor de páginas, janelas, views, eventos, ações,
estado visual e a ponte entre intenção de interface e commands, queries e
capabilities do AppCore.

## Modelo de superfície planejado

Os conceitos centrais devem ser:

- `UiSurface`: superfície de interface pertencente ao runtime;
- `UiDocument`: descrição estruturada de páginas, views, bindings e ações;
- `Window`, `Page`, `View` e `Viewport`: fronteiras de lifecycle e renderização;
- contratos de evento, ação, estado e lifecycle;
- bindings de ações de UI para commands AppCore;
- bindings de queries AppCore para estado visual;
- acesso a comportamento de runtime e aplicação controlado por capabilities.

O fluxo planejado é explícito:

```text
UI Event -> Action -> AppCore Command
AppCore Query -> Visual State -> UI
```

## Web Surface

O caminho web-like deve suportar páginas mantidas ou geradas com HTML e
TypeScript, parecido com uma superfície de aplicação no estilo Tauri. Esse é o
caminho prático para settings, admin, UI de negócio desktop, ferramentas
internas, dashboards e páginas geradas a partir de descrições estruturadas.

Nenhum contrato final de WebView, browser engine ou bundler está prometido.

## Native Surface

O caminho nativo deve abrir espaço para páginas renderizadas em Rust com apoio
de um motor gráfico. Ele serve para interfaces que precisam ir além de uma UI em
formato de documento:

- janelas de render 2D ou 3D;
- jogos;
- ferramentas técnicas;
- dashboards em tempo real;
- editores customizados;
- telas de negócio com sistemas visuais próprios;
- UI gerada que deve virar nativa em vez de HTML.

O `appcore-ui` deve definir a fronteira de superfícies, eventos e estado. Ele
não deve fingir ser uma graphics engine completa. Se renderização crescer
demais, uma futura crate de render pode possuir os detalhes de backend.

## Direção do Page Builder

Um futuro page builder pode existir sobre `appcore-ui`, com itens pré-codados
montados em páginas. O builder deve gerar artifacts estruturados de UI em vez de
esconder comportamento em templates soltos.

IA pode ajudar a gerar um `UiDocument`, propor layouts ou criar drafts de
páginas, mas `appcore-ai` não deve possuir o sistema de UI. O contrato de UI
permanece separado para que uma página possa nascer de builder humano,
templates estáticos, codegen ou ferramentas assistidas por IA.

## Limites

- `appcore-ui` ainda não foi publicado.
- Ele não deve incluir instruções de instalação antes da release.
- Ele não deve prometer WebView ou backend gráfico final.
- Ele não deve misturar geração de UI com ownership de IA, search ou agent.
- API pública, contratos de renderização, fronteira de dependências, versão,
  MSRV e exemplos executáveis continuam provisórios até a release.
