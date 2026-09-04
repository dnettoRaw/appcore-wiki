---
title: appcore-log
sidebar_position: 27
---

# appcore-log

Stable documentation ID: **ACR-027**.

`appcore-log` is the bounded structured logging pipeline shared by Runtime
components and the SDK. It separates severity from V1–V9 verbosity, filters
before formatting, sanitizes before ordinary sinks, and accounts destination
failures without recursively logging them.

## Choose it when

- an application needs terminal, JSONL, both, disabled, or crash-only output;
- a Runtime component needs hierarchical per-component filtering;
- logs need explicit file size, rotation, archive, event-count, and memory
  limits;
- sensitive diagnostics must use authenticated encrypted DNT.

It is not a process-global logging facade, profiler, telemetry vendor adapter,
or panic handler. The owner constructs and retains `ConfiguredLogger`.

## Main contracts

- `LoggerConfig` and `LogOutputMode` select normal destinations;
- `LogPolicy` controls verbosity, path aliases, and sensitivity;
- `LogDispatcher` filters, sanitizes, fans out, and exposes counters;
- `FileSinkConfig` and `FileArchiveConfig` bound JSONL history;
- `RingBufferSink` bounds in-memory diagnostics by count and retained bytes;
- `SensitiveDntSink` is the only built-in sensitive destination.

The active file directory must already exist. Archive `YYYY/MM` directories
are created when rotation needs them. `sync_each_write` trades throughput for
per-event storage durability.

For complete setup, limits, examples, and benchmark commands, use the
crate-owned [English guide](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.en.md),
[Portuguese guide](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.pt.md),
or [French guide](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.fr.md).
The source also keeps the runnable [basic example](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/basic.en.md)
and [intermediate example](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/intermediate.en.md).
