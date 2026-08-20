---
title: Primeira aplicação
sidebar_position: 11
---

# Primeira aplicação

O objetivo deste tutorial não é criar um produto. É enxergar a fronteira:
código de negócio declara comportamento, manifests declaram contrato e
deployment escolhe ambiente. O antigo template interno foi removido; uma nova
aplicação agora segue diretamente o contrato público de três artefatos.

## Instale a facade publicada

```bash
cargo add appcore-bin@1.0.1-rc.8
```

Esse é o ponto de entrada manifest-first publicado. Os outros crates públicos
estão disponíveis para consumidores de baixo nível, integração de CLI e
adapters de provider; consulte o
[catálogo de crates](/crates/) antes de depender deles diretamente.

A implementação mínima registra um command e um handler. A entrada deve continuar pequena:

```rust
fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

O command precisa existir no Application Manifest:

```toml
[[capabilities]]
id = "app.ping"
version = "1"
mode = "command"
idempotency_required = true
```

O deployment escolhe provider e listener:

```toml
mode = "standalone"
secrets = { runtime_security = "env:APPCORE_EXAMPLE_SECRET" }
paths = { storage = "target/runtime/storage", backup = "target/runtime/backups" }

[storage]
provider_id = "file"

[network]
listen_addresses = ["127.0.0.1:39300"]
```

Teste a seguir: mismatch de manifest, command não declarado, idempotency ausente, path traversal em storage e shutdown cooperativo.

Para iniciar no diretório raiz da aplicação, forneça o registro estruturado da
chave, não apenas os bytes secretos:

```bash
now_ms="$(($(date +%s) * 1000))"
export APPCORE_EXAMPLE_SECRET="$(printf \
  'key_id=local-%s\ncreated_at_ms=%s\nexpires_at_ms=none\nstatus=active\nsecret=hex:%s\n' \
  "$now_ms" "$now_ms" "$(openssl rand -hex 32)")"
cargo run
```

## Limitations

- O exemplo usa command mínimo e não modela workflow de domínio.
- Assume a facade pública `appcore_bin::application` e os paths padrão
  `application.toml`/`deployment.toml`.
- Demonstra deployment standalone local, não cluster completo.
- Não cobre provider customizado nem gestão de secrets em produção.
