---
title: Bootstrap e runtime host
sidebar_position: 3
---

# Bootstrap e runtime host

Bootstrap começa em `run_application`. O host lê `application.toml` e `deployment.toml` ou os overrides `APPCORE_APPLICATION_MANIFEST` e `APPCORE_DEPLOYMENT_MANIFEST`, valida os manifests e cria o `ManifestApplicationHost`.

## Validações iniciais

Os paths são canonicalizados, TOML é parseado para contratos versionados e os dois manifests precisam ter o mesmo `application_id`. Entradas removidas, como `runtime.toml` ou configs antigas com `app_id` sem `manifest_version`, falham com `NO MORE SUPPORTED PLEASE UPDATE`.

## Fluxo real

```mermaid
flowchart TD
    Load[Carregar manifests] --> Context[Resolver DeploymentContext]
    Context --> Configure[Application.configure]
    Configure --> Plugin[ManifestApplicationPlugin]
    Plugin --> Bootstrap[bootstrap_runtime_from_manifest]
    Bootstrap --> Query[Query router]
    Query --> Tasks[Task registry]
    Tasks --> Validate[Validar contrato de negócio]
    Validate --> Run[Rodar serviços selecionados]
```

O runtime deriva `RuntimeConfig`: IDs de node/core/instance pertencem ao runtime, listener vem do deployment, cluster mode habilita sync, payloads são limitados, TTLs são política do runtime e watchdog vem do deployment.

Commands continuam protegidos pelo manifest. Capability ausente falha. Command que exige idempotency key falha antes do handler se a chave não vier.

O manifest distribuído final produz um único `CapabilityCatalog` no bootstrap.
Facade direta, HTTP da aplicação e Peer RPC usam esse mesmo catálogo para
validar declaração, mode, idempotência, escrita operacional e liderança. Um
`CapabilityRegistry` só existe quando há handler local real; queries de status
do Runtime continuam comportamento explícito do host.

O candidato `appcore-api 1.0.2-rc` também possui uma fronteira opt-in de geração de routing
para o serviço HTTP. Ela prepara e verifica um Router mais novo antes de uma
troca atômica e depois drena requests já admitidos pela geração antiga. Isso não
é um watcher implícito de manifest V1. Veja [reload coordenado](./reload).

## Limitations

- Bootstrap não infere providers nem aplica fallback silencioso.
- Config antiga sem versão não é convertida.
- Tasks de negócio não são iniciadas fora do scheduler do runtime.
- Commands não declarados no manifest são rejeitados.
- Update automático exige caminho supervisionado; execução direta não gerenciada rejeita esse modo.

Próximo: [storage](/architecture/storage).
