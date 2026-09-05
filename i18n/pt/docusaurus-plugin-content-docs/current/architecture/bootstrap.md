---
title: Bootstrap e composição do deployment
sidebar_position: 3
---

# Bootstrap e composição do deployment

O SDK prepara comportamento da aplicação; não fornece host de processo Runtime
nem CLI. A composição do processo pertence ao deployment.

## Contexto local e preparação

`App::new` constrói manifests V1 canônicos validados em memória.
`appcore_sdk::run` cria esse contexto e chama uma closure; não lê arquivos de
manifest nem inicia listeners, storage, sync ou cluster. Manifests explícitos
substituem defaults pelos métodos validados do SDK.

`App::prepare` registra comportamento e retorna `PreparedApplication`.
O valor preparado possui registries Core e callbacks. Com `api`, queries são
registradas num router congelado; com `scheduler`, tasks são coletadas num
registry limitado. Preparação não é startup de serviços.

## Validar antes de iniciar serviços

O deployment que lê arquivos deve limitar a leitura antes da alocação, validar
UTF-8 e schemas versionados e conferir a identidade da aplicação nos manifests.
Um teto de 1 MiB com leitor `Take(limit + 1)` é uma política explícita útil do
deployment, não uma garantia automática de filesystem do SDK. Não infira nem
converta entradas removidas sem versão; contratos removidos rejeitados usam
`NO MORE SUPPORTED PLEASE UPDATE`.

Resolva descriptors de providers, referências de segredo e bindings antes de
abrir serviços. Rejeite providers desconhecidos e garantias insuficientes, sem
fallback. A configuração da aplicação recebe `DeploymentContext` validado;
composição de infraestrutura fica fora dos hooks de negócio.

## Conectar a aplicação preparada

O deployment escolhe listeners, autenticação, budgets de payload, TTLs de token
e idempotência, políticas de sync/cluster e configuração do Supervisor.
Declarar um provider ID no manifest não instancia sua implementação.

Componha um `CapabilityCatalog` compartilhado para HTTP, chamadas diretas e
Peer RPC quando habilitados. Confira declaração, mode, idempotência, escrita
operacional e liderança antes dos handlers. Registre capabilities locais
somente para handlers reais. O SDK não conecta automaticamente esse catálogo
a todos os transportes.

## Startup e shutdown

Registre serviços gerenciados no Supervisor, declare dependências e comprove
readiness por probes limitados. Deployment controla sinais, restart e
ativação/rollback de updates. Shutdown é cooperativo; quarantine não mata
threads Rust arbitrárias com segurança. Teste startup real, degradação e
shutdown separadamente dos testes de preparação.

Gerações de routing HTTP são primitivas opt-in: [reload coordenado](./reload)
não monitora manifests nem troca endereços de listeners automaticamente.

## Evidência e limites

Testes consumidores SDK provam manifests, registro e dispatch no escopo
testado, não cluster de produção ou host oculto. Deployments externos devem
fornecer evidência de service manager, rede, recuperação e recursos. Não há
inferência de providers, fallback silencioso ou parser de compatibilidade.

Próximo: [storage](/pt/architecture/storage).
