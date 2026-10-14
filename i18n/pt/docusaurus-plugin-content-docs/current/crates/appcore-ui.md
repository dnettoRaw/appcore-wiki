---
title: appcore-ui — Beta
sidebar_position: 24
---

# appcore-ui

:::info Beta pública
`appcore-ui 0.1.0-beta.1` está disponível no crates.io. O rendering atual suporta macOS.
:::

## Beta pública independente

`appcore-ui 0.1.0-beta.1` renderiza páginas nativas definidas em Rust e páginas
web locais produzidas em HTML/TypeScript. Está disponível como beta pública.
O backend atual é macOS; outras plataformas continuam trabalho futuro.
O roadmap mais amplo de UI não representa APIs já implementadas.

O módulo possui janelas, rendering, ações e bridge Runtime. Aplicações possuem
layouts, schemas e regras de negócio. Deployment seleciona backend e autorização
de principal/capabilities e possui arranque, pump e shutdown. O SDK prepara
registos; não inicia host UI ou executor escondidos.

## Páginas nativas e web

`UiNativePageV1` declara texto/botões validados com frames fixos. O backend opcional
`native-macos` chama controlos do sistema diretamente. Janelas e filas de ações
são limitadas; ativações não contornam autorização Runtime.

`UiWebBundle` contém HTML, JavaScript, CSS, imagens e fonts imutáveis produzidos
pela aplicação, com paths/MIME explícitos. Limites: 512 recursos, 2 MiB por recurso,
16 MiB de fonte retida. Não limitam toda a memória do engine do sistema.
O backend opcional `web-macos` usa o componente web do SO, sem empacotar engine.
Serve uma origem local aleatória por janela, CSP/nosniff, armazenamento não
persistente, sem navegação externa, frames, popups ou rede. Bindings do sistema
são opcionais e isolados; o crate padrão não os inclui.

## Bridge Runtime e recuperação

`attach_surface` é explícito antes do carregamento. Caller/origin nativos são
verificados; JSON não escolhe principal ou tenant. Autorização obrigatória e
catálogo declarado protegem commands, queries e subscrições. Commands preservam
idempotência e eventos dos donos Runtime existentes. UI V1 é independente das
versões de manifests/peer; versões não suportadas retornam
`NO MORE SUPPORTED PLEASE UPDATE`.

O cliente TypeScript tipado não adiciona biblioteca runtime. Pedidos, mensagens,
subscrições e filas têm limites, deadlines e cancelamento cooperativo. Backpressure
e perdas são visíveis. Offline invalida subscrições; reconnect cria nova
janela/superfície e consulta estado atual. Close rejeita Promises pendentes e
liberta a superfície. Cancelamento não faz rollback de efeitos. O pump exige
backend/autorização não bloqueantes ou fronteira bloqueante explícita limitada;
nenhum worker/executor é escondido no renderer.

## Evidência e escopo

Janelas nativas e web reais foram inspecionadas. Ação nativa, atualização DOM,
rejeição de navegação externa/script inline e close limpo foram verificados.
Fixture SDK executou query, command, subscrição e replay: um efeito, um evento
Runtime e uma notificação; autoridade forjada e superfície alheia rejeitadas.

Consumidor externo independente reutilizou tela e CSS existentes com dados
sintéticos. Atualização executou segunda query; close nativo terminou 0 com
`status_queries=2 pending_requests=0 retained_windows=0`. Qualifica integração
isolada, não login/dados de produção nem migração completa da aplicação. Testes
Rust/TypeScript cobrem validação, autorização, saturação, cancelamento, deadlines,
reconexão, perdas de fila e shutdown.

Limites iniciais: rendering macOS, layout nativo fixo e notificações efémeras.
Page builder, geração IA, 3D nativo e MCU continuam futuros. Esta beta não qualifica deployment de aplicações em produção. Schemas UI novos não têm versão persistida anterior a converter;
evolução incompatível exige versão explícita e revisão de migração/rollback,
mantendo manifests atuais intactos.

## Exemplos interativos e funções nativas

O perfil nativo inclui agora texto editável, checkbox, dropdown, slider e progresso determinado, além de texto/botões. `elements::{text,button,input,toggle,select,slider,progress}` são construtores Rust puros; valide a página completa. `UiNativeWindow::{set_label,set_value,set_enabled,value}` atualizam/leem controlos existentes com validação tipada e limites de página/label, sem alterar ações ou conceder autorização. Dropdowns admitem 1–64 labels únicos não vazios; o input é limitado ao ler, sem garantir toda a memória dos controlos de edição do SO.

A galeria usa Editing → Review → Applied, revisões, campos bloqueados e comandos tipados por script. Não há IA ligada. O runner tem física determinística, colisão/score/restart/pausa. O exemplo 3D usa WebGL direto do sistema, perspetiva/profundidade e seis trajetórias de Lorenz, integração RK4, 24.576 pontos limitados, órbita/zoom, isolamento de trajetória, pausa e avanço por passos; não é engine 3D nativa Rust.

Os quatro exemplos foram renderizados e usados em janelas macOS reais; fechar cada um terminou 0 com zero janelas retidas. A proposta de componentes/IA é roadmap, não protocolo de tools implementado.

## Instalação e documentação

```toml
[dependencies]
appcore-ui = { version = "=0.1.0-beta.1", features = ["web-macos"] }
```

[crates.io](https://crates.io/crates/appcore-ui/0.1.0-beta.1) · [API](https://docs.rs/appcore-ui/0.1.0-beta.1/appcore_ui/)

- [Guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/guide.pt.md)
- [Basic](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/examples/basic.pt.md)
- [Intermediate](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/examples/intermediate.pt.md)

## Resposta à interação

O pump serve o run loop mesmo sob carga de input e a bridge antes/depois do dispatch nativo. A drenagem para quando a fila de ativações enche; consuma `pending_activations` com `next_activation` depois do pump. Tracking/callbacks do sistema podem exceder o orçamento cooperativo. A WebView aceita o primeiro clique físico ao ativar uma janela inativa; muda o foco, não a autorização. Os testes físicos receberam dez de dez ações nos exemplos nativo e web, e um clique ao alternar janelas.
