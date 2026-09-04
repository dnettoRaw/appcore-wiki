---
title: appcore-log
sidebar_position: 27
---

# appcore-log

ID stable de documentation : **ACR-027**.

`appcore-log` est le pipeline structuré et borné partagé par le Runtime et le
SDK. Il sépare sévérité et verbosité V1–V9, filtre avant formatage, assainit
avant les sinks ordinaires et compte les échecs sans logging récursif.

Utilisez-le pour terminal, JSONL, les deux, aucun log ou seulement les crashs ;
pour les filtres par composant, la rétention bornée ou le DNT Sensitive chiffré.
Ce n'est ni un logger global, ni un profiler, ni un adapter vendor ou panic hook.

Contrats principaux : `LoggerConfig`, `LogOutputMode`, `LogPolicy`,
`LogDispatcher`, `FileSinkConfig`, `FileArchiveConfig`, `RingBufferSink` et
`SensitiveDntSink`.

Consultez le [guide complet du crate](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.fr.md).
Exécutez aussi l’[exemple de base](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/basic.fr.md)
et l’[exemple intermédiaire](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/intermediate.fr.md).
