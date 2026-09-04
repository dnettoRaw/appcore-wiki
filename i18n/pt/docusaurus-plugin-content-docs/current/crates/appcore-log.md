---
title: appcore-log
sidebar_position: 27
---

# appcore-log

ID estável da documentação: **ACR-027**.

`appcore-log` é o pipeline estruturado e limitado compartilhado pelo Runtime e
pelo SDK. Ele separa severidade de verbosidade V1–V9, filtra antes de formatar,
sanitiza antes dos sinks normais e contabiliza falhas sem logging recursivo.

Use-o para terminal, JSONL, ambos, modo desligado ou somente crash; filtros por
componente; retenção limitada; ou diagnósticos Sensitive criptografados em DNT.
Ele não é logger global, profiler, adapter de vendor nem panic handler.

Contratos principais: `LoggerConfig`, `LogOutputMode`, `LogPolicy`,
`LogDispatcher`, `FileSinkConfig`, `FileArchiveConfig`, `RingBufferSink` e
`SensitiveDntSink`.

Consulte o [guia completo do crate](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.pt.md).
Execute também o [exemplo básico](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/basic.pt.md)
e o [exemplo intermediário](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/intermediate.pt.md).
