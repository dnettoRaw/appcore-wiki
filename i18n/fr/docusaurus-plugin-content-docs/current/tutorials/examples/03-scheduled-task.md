---
title: 3. Tâche planifiée
sidebar_position: 3
---

# 3. Tâche planifiée

À ce niveau, l'application possède le callback, tandis qu'AppCore possède les
workers du scheduler, la concurrence, le délai des retries, l'isolation des
panics, l'annulation et le shutdown.

## Déclarer le besoin

Modifier la section scheduler de l'Application Manifest :

```toml title="application.toml"
[scheduler]
required = true
max_concurrency = 1
```

Si le manifest exige le scheduling mais que le code métier n'enregistre aucune
tâche, le bootstrap échoue. L'incohérence inverse échoue également.

## Enregistrer une tâche bornée

Ajouter ces imports à ceux de la façade application :

```rust
use appcore_bin::application::{
    ApplicationTaskRegistry, RetryPolicy, ScheduledTask, TaskSchedule,
};
use std::time::Duration;
```

Puis ajouter cette méthode à `impl Application for EchoApplication` :

```rust
fn register_tasks(
    &self,
    registry: &mut ApplicationTaskRegistry,
) -> RuntimeResult<()> {
    registry.register(
        ScheduledTask {
            id: "example.maintenance".to_string(),
            schedule: TaskSchedule::Interval {
                every: Duration::from_secs(3_600),
                start_at: None,
            },
            retry: RetryPolicy::default(),
            priority: 1,
            trace: None,
        },
        |_context| {
            // Exécuter une unité bornée de travail appartenant à l'application.
            Ok(())
        },
    )
}
```

`RetryPolicy::default()` effectue une tentative. Utiliser une policy explicite
lorsqu'un retry est sûr :

```rust
retry: RetryPolicy {
    max_attempts: 3,
    initial_backoff: Duration::from_secs(1),
    max_backoff: Duration::from_secs(30),
    multiplier: 2,
    jitter: Duration::from_millis(250),
},
```

Le callback retourne `Result<(), String>`. Il doit rester borné et coopératif ;
ne pas y démarrer un thread détaché ni une boucle sans fin.

## Vérifier la responsabilité du Runtime

Le test manifest-first existant peut inspecter le rapport des services :

```rust
let report = host
    .probe_services(Duration::from_secs(2))
    .expect("service probe");
assert!(report.scheduler_started);
```

Tester également :

- `every = Duration::ZERO` est rejeté ;
- les identifiants de tâche dupliqués sont rejetés ;
- le travail retentable est idempotent ;
- le shutdown empêche de nouvelles admissions ;
- un échec du callback produit un échec de tâche contrôlé.

## Ne pas l'utiliser comme moteur de workflow

Le scheduler est local au processus. Les workflows durables en plusieurs
étapes, les transactions inter-services et une queue distribuée restent hors
de ce profil.

Suite : [exécuter le même code métier en mode cluster](./standalone-to-cluster).
