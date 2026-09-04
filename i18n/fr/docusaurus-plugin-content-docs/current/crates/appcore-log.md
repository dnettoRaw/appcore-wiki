---
title: appcore-log
sidebar_position: 27
---

# appcore-log

ID stable de documentation : **ACR-027**.

Version publiée : [`appcore-log 1.0.0-rc.1`](https://crates.io/crates/appcore-log/1.0.0-rc.1).

`appcore-log` est le pipeline structuré et borné partagé par le Runtime et le
SDK. Il sépare sévérité et verbosité V1–V9, filtre avant formatage, assainit
avant les sinks ordinaires et compte les échecs sans logging récursif.

## Quand l'utiliser

- lorsqu'une application doit écrire vers le terminal, JSONL, les deux, aucun
  log ou uniquement lors d'un crash ;
- lorsqu'un composant Runtime nécessite des filtres hiérarchiques propres ;
- lorsque les logs exigent des limites explicites de taille, rotation,
  archivage, nombre d'événements et mémoire ;
- lorsque les diagnostics sensibles doivent employer un DNT authentifié et
  chiffré.

Ce n'est ni une façade globale de logging, ni un profiler, ni un adaptateur de
fournisseur de télémétrie, ni un panic handler. Le propriétaire construit et
conserve `ConfiguredLogger`.

## Contrats principaux

- `LoggerConfig` et `LogOutputMode` sélectionnent les destinations normales ;
- `LogPolicy` contrôle verbosité, alias de chemins et sensibilité ;
- `LogDispatcher` filtre, assainit, distribue et expose les compteurs ;
- `FileSinkConfig` et `FileArchiveConfig` bornent l'historique JSONL ;
- `RingBufferSink` borne les diagnostics en mémoire par nombre et octets ;
- `SensitiveDntSink` est la seule destination sensible intégrée.

Le répertoire des fichiers actifs doit déjà exister. Les répertoires d'archive
`YYYY/MM` sont créés lorsque la rotation en a besoin. `sync_each_write` échange
du débit contre la durabilité de chaque événement.

Pour le setup complet, les limites, les exemples et les commandes de benchmark,
consultez le [guide en anglais](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.en.md),
le [guide en portugais](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.pt.md)
ou le [guide en français](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/guide.fr.md).
Le code source conserve aussi l’[exemple de base](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/basic.fr.md)
et l’[exemple intermédiaire](https://github.com/dnettoRaw/app-core-public/tree/beta/appcore-log/wiki/examples/intermediate.fr.md).
