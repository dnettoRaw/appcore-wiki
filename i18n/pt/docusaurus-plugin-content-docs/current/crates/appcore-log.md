---
title: appcore-log
sidebar_position: 27
---

# appcore-log

ID estável da documentação: **ACR-027**.

Release publicada: [`appcore-log 1.0.0-rc.1`](https://crates.io/crates/appcore-log/1.0.0-rc.1).

`appcore-log` é o pipeline estruturado e limitado compartilhado pelo Runtime e
pelo SDK. Ele separa severidade de verbosidade V1–V9, filtra antes de formatar,
sanitiza antes dos sinks normais e contabiliza falhas sem logging recursivo.

## Quando usar

- quando uma aplicação precisa emitir para terminal, JSONL, ambos, modo
  desligado ou somente em caso de crash;
- quando um componente do Runtime precisa de filtros hierárquicos próprios;
- quando os logs precisam de limites explícitos de arquivo, rotação, arquivo
  histórico, quantidade de eventos e memória;
- quando diagnósticos sensíveis precisam usar DNT autenticado e criptografado.

Ele não é uma fachada global de logging, profiler, adaptador de fornecedor de
telemetria nem panic handler. O owner constrói e mantém `ConfiguredLogger`.

## Contratos principais

- `LoggerConfig` e `LogOutputMode` selecionam os destinos normais;
- `LogPolicy` controla verbosidade, aliases de path e sensibilidade;
- `LogDispatcher` filtra, sanitiza, distribui e expõe contadores;
- `FileSinkConfig` e `FileArchiveConfig` limitam o histórico JSONL;
- `RingBufferSink` limita diagnósticos em memória por quantidade e bytes;
- `SensitiveDntSink` é o único destino sensível integrado.

O diretório de arquivos ativos precisa existir. Os diretórios de arquivo
histórico `YYYY/MM` são criados quando a rotação precisa deles.
`sync_each_write` troca throughput por durabilidade de cada evento.

Para setup completo, limites, exemplos e comandos de benchmark, consulte o
[guia em inglês](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.en.md),
[guia em português](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.pt.md)
ou [guia em francês](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.fr.md).
O código-fonte também mantém o [exemplo básico](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/basic.pt.md)
e o [exemplo intermediário](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/intermediate.pt.md).
