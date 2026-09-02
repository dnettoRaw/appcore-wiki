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

## `1.0.2-rc` : récupération opt-in

La version candidate `1.0.2-rc` implémente la frontière
`SchedulerStateProvider` V1. `Scheduler::with_state_provider` sélectionne un
owner borné, le TTL du claim, la tolérance de clock skew et le provider ;
`schedule_durable` inscrit des tâches individuelles dans l'état persistant de
next run, attempt, misfire, fencing et receipt. `Scheduler::new` et `schedule`
restent éphémères et offline.

Le provider fichier combine le locking local et interprocessus avec un snapshot
V1 borné et checksummed et un remplacement atomique. Les claims sont acquis
avant dispatch et renouvelés pendant l'exécution. Les callbacks reçoivent
`TaskContext::fencing_epoch()` et doivent l'appliquer à la frontière de l'effet
protégé quand plusieurs owners sont possibles. La récupération reste
at-least-once jusqu'au commit du receipt ; callbacks et données de workflow de
l'application ne sont jamais sérialisés.

Le source actuel valide les champs task, definition, owner et claim par emprunt
et compare l'ordre avec le dernier record converti. Un snapshot maximal de
1 024 records sans claims évite 3 072 allocations temporaires de chaînes sans
modifier le format ni les contrôles V1.

Cette API décrit uniquement l'état du source. Elle ne doit pas être considérée
comme disponible dans le paquet stable `1.0.0` indiqué ci-dessus.

:::warning Mise à jour recommandée
Installez la version du scheduler contenant AC-018 dès qu'elle sera disponible.
Les versions antérieures créent un nouveau thread système par exécution ; ce
chemin legacy n'est pas conservé à côté de la correction bornée.
:::

**Maturité :** profil local stable; scheduling local au processus.
