---
title: Ownership da facade appcore-bin
sidebar_position: 13
---

# Ownership da facade appcore-bin

A AC-023 avaliou mover a facade manifest-first para um crate SDK leve enquanto
`appcore-bin` continuaria como host do Runtime.

## Decisão

`appcore-bin` permanece a facade manifest-first pública e a única composition
root no contrato 1.x atual. Nenhum crate `appcore-sdk` ou `appcore-runtime` é
criado.

Aplicações continuam implementando `appcore_bin::application::Application` e
chamando `appcore_bin::application::run_application`. Isso mantém um único
owner para manifests, providers, listeners, lifecycle, Supervisor e shutdown,
preservando o [contrato de três artefatos](./three-artifact-contract).

## Evidência

Um build otimizado limpo do consumer mantido de três artefatos no commit
`a33a934`, com Rust 1.97.1 em macOS arm64, teve 22 pacotes AppCore e 196 pacotes
no grafo normal. Levou 170,46 segundos, atingiu 693.846.016 bytes de RSS máximo,
gerou um binário de 10.242.592 bytes e ocupou 481.808 KiB no target Cargo novo.

O custo de compilação é real, mas separar apenas traits da facade não remove o
grafo do host do executável: `run_application` ainda precisa alcançar a
composition root concreta. A divisão adicionaria um crate ou mudaria o caminho
público estável sem demonstrar benefício no artefato.

## Reavaliação

A decisão só pode ser reavaliada em um marco 1.x posterior com consumers reais
que sejam apenas bibliotecas, um único owner de composição em grafo acíclico,
evidência de consumer empacotado e SemVer, e redução medida mínima de 20% no
build limpo ou no grafo. Alias de compatibilidade, migração implícita e segunda
composition root continuam proibidos.
