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

O `appcore-ui` é o crate planejado para UI e page builder no AppCore. Esta
página reserva seu lugar no catálogo enquanto a implementação e o contrato
público são finalizados.

A direção prevista é dar suporte a páginas que podem ser mantidas e geradas a
partir de fluxos simples em HTML e TypeScript, em uma superfície de aplicação
no estilo Tauri, sem fechar a porta para páginas nativas em Rust renderizadas
por um motor gráfico.

Esse caminho de renderização nativa é pensado para interfaces que precisam ir
além de uma UI em formato de documento, incluindo janelas de render 3D, jogos,
telas de negócio, sistemas de design próprios e outras experiências em que o
limite é o design da aplicação, não o formato da página.

Um futuro page builder está planejado sobre esse crate, com itens pré-codados
que podem ser montados em páginas. A API pública, os contratos de renderização,
a fronteira de dependências, a versão, a MSRV, as instruções de instalação e os
exemplos serão adicionados quando o crate estiver pronto para a release.
