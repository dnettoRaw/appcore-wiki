---
title: appcore-scheduler
sidebar_position: 14
---

# appcore-scheduler

:::info Paquet publié
Publié **`1.0.1-rc.8`** · workspace Runtime actuel **`1.0.1-rc.9`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-scheduler/1.0.1-rc.8) · [docs.rs](https://docs.rs/crate/appcore-scheduler/1.0.1-rc.8) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/main/crates/appcore-scheduler)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-scheduler/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-scheduler/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/main/crates/appcore-scheduler/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** exécution locale bornée et placement Core explicable.

**Dépendances internes :** `appcore-contracts`, `appcore-core`.

**API principale :** `Scheduler`, `SchedulerConfig`, `ScheduledTask`,
`TaskSchedule`, callback/context/result, retry policy, handle et snapshots;
requêtes/candidats/rejets/évaluations/décisions ressources et
`PlacementEngine`.

À utiliser pour travail local déclaré avec limites, annulation et shutdown. Ce
n'est ni workflow engine durable ni file distribuée.

Le shutdown ferme l'admission sous le lock d'état et l'arithmétique des
deadlines est vérifiée. Les temps one-shot, interval ou retry non
représentables renvoient `InvalidSchedule` ou retirent la task épuisée au lieu
de paniquer.

**Maturité :** profil local RC stable; scheduling local au processus.
