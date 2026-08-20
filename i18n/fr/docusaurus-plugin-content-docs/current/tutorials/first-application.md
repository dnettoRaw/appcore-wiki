---
title: Première application
sidebar_position: 11
---

# Première application

Le but n'est pas de créer un produit complet. Il s'agit de voir la frontière :
le code métier déclare le comportement, les manifests déclarent le contrat et
le deployment choisit l'environnement. L'ancien template interne a été retiré ;
une nouvelle application suit directement le contrat public à trois artefacts.

## Installer la façade publiée

```bash
cargo add appcore-bin@1.0.0
```

C'est le point d'entrée manifest-first publié. Les autres crates publics sont
disponibles pour les consommateurs bas niveau, l'intégration CLI et les
adapters provider ; consulter le
[catalogue des crates](/crates/) avant d'en dépendre directement.

L'implémentation minimale enregistre une command et un handler. L'entrée reste petite :

```rust
fn main() {
    if let Err(error) = appcore_bin::application::run_application(&BackendApplication) {
        eprintln!("application failed: {error}");
        std::process::exit(1);
    }
}
```

La command doit exister dans l'Application Manifest :

```toml
[[capabilities]]
id = "app.ping"
version = "1"
mode = "command"
idempotency_required = true
```

Le deployment choisit provider et listener :

```toml
mode = "standalone"
secrets = { runtime_security = "env:APPCORE_EXAMPLE_SECRET" }
paths = { storage = "target/runtime/storage", backup = "target/runtime/backups" }

[storage]
provider_id = "file"

[network]
listen_addresses = ["127.0.0.1:39300"]
```

Tests suivants : mismatch de manifest, command non déclarée, idempotency absente, path traversal dans storage et shutdown coopératif.

Pour démarrer depuis la racine du projet applicatif, fournir l'enregistrement
structuré de la clé et pas seulement les octets secrets :

```bash
now_ms="$(($(date +%s) * 1000))"
export APPCORE_EXAMPLE_SECRET="$(printf \
  'key_id=local-%s\ncreated_at_ms=%s\nexpires_at_ms=none\nstatus=active\nsecret=hex:%s\n' \
  "$now_ms" "$now_ms" "$(openssl rand -hex 32)")"
cargo run
```

## Limitations

- L'exemple utilise une command minimale et ne modélise pas un workflow métier.
- Il suppose la façade publique `appcore_bin::application` et les chemins
  standards `application.toml`/`deployment.toml`.
- Il démontre un deployment local standalone, pas un cluster complet.
- Il ne couvre pas provider custom ni gestion de secrets en production.
