---
title: 3. Task agendada
sidebar_position: 3
---

# 3. Task agendada

Neste nível, a aplicação possui o callback e o AppCore possui workers,
concorrência, retry timing, isolamento de panic, cancelamento e shutdown.

## Declare o requisito

Altere a seção de scheduler no Application Manifest:

```toml title="application.toml"
[scheduler]
required = true
max_concurrency = 1
```

Se o manifest exigir scheduler e o código não registrar task, o bootstrap
falha. O mismatch inverso também falha.

## Registre uma task limitada

Adicione estes imports:

```rust
use appcore_bin::application::{
    ApplicationTaskRegistry, RetryPolicy, ScheduledTask, TaskSchedule,
};
use std::time::Duration;
```

Adicione o método a `impl Application for EchoApplication`:

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
            // Execute uma unidade limitada de trabalho da aplicação.
            Ok(())
        },
    )
}
```

`RetryPolicy::default()` executa uma tentativa. Quando repetir for seguro, use
policy explícita:

```rust
retry: RetryPolicy {
    max_attempts: 3,
    initial_backoff: Duration::from_secs(1),
    max_backoff: Duration::from_secs(30),
    multiplier: 2,
    jitter: Duration::from_millis(250),
},
```

O callback retorna `Result<(), String>`. Mantenha-o limitado e cooperativo; não
inicie thread solta nem loop infinito dentro dele.

## Verifique ownership do Runtime

O teste manifest-first pode inspecionar o service report:

```rust
let report = host
    .probe_services(Duration::from_secs(2))
    .expect("service probe");
assert!(report.scheduler_started);
```

Teste também:

- `every = Duration::ZERO` é rejeitado;
- IDs de task duplicados são rejeitados;
- trabalho com retry é idempotente;
- shutdown fecha novas admissões;
- falha do callback vira falha controlada da task.

## Não use como workflow engine

O scheduler é local ao processo. Workflows duráveis em várias etapas,
transações entre serviços e fila distribuída ficam fora deste perfil.

Próximo: [rodar o mesmo código de negócio em cluster](./standalone-to-cluster).
