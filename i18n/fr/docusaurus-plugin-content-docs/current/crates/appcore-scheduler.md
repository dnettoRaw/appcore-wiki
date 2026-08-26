---
title: appcore-scheduler
sidebar_position: 14
---

# appcore-scheduler

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-scheduler/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-scheduler/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-scheduler)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-scheduler/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

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

Les callbacks utilisent un pool fixe limité par `max_concurrent_tasks` et une
file interne bornée. Le travail dû excédentaire reste planifié sans consommer
de retry ; `worker_thread_count`, `queued_task_count` et
`queue_saturation_count` exposent la limite et la pression. Le shutdown draine
les callbacks acceptés avec annulation coopérative ; les callbacks doivent
consulter `TaskContext::is_cancelled()` car les threads Rust ne reçoivent pas de
timeout forcé.

:::warning Mise à jour recommandée
Installez la version du scheduler contenant AC-018 dès qu'elle sera disponible.
Les versions antérieures créent un nouveau thread système par exécution ; ce
chemin legacy n'est pas conservé à côté de la correction bornée.
:::

**Maturité :** profil local stable; scheduling local au processus.
