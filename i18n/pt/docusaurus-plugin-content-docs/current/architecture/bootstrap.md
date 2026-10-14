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

## Identidade da operação e recuperação da conclusão

Contrato de código-fonte ainda não publicado: a chave é única no store; `command-v2:` vincula ID da aplicação, nome do command e payload delimitado por comprimento com SHA-256. Node, ID do pedido, data e trace são metadados de transporte e podem mudar na repetição. Outra aplicação ou operação com a mesma chave devolve `IdempotencyConflict`. Fingerprints apenas do payload falham no dispatch com `NO MORE SUPPORTED PLEASE UPDATE`, sem conversão. Drene e reconcilie a instalação antiga, arquive o store e selecione explicitamente um store novo antes de atualizar. O rollback usa executável e store originais; nunca os misture.

São admitidas no máximo 64 conclusões com chave, em execução ou recuperáveis, com resultado serializado de até 1 MiB cada (limite de 64 MiB de corpos retidos). Uma falha na escrita do recibo retém o resultado no buffer partilhado do controller. A repetição idêntica persiste o mesmo recibo e publica eventos uma vez neste processo, sem repetir o handler, incluindo uma escrita ambígua já realizada pelo store. `recoverable_command_completions` conta resultados retidos. O buffer cheio rejeita antes do handler. Um resultado excessivo deixa uma reserva durável pendente para reconciliação.

A abertura do ficheiro e a compactação TTL preservam `Pending`; só recibos resolvidos expiram. Após perda do processo, o dispatch não deduz o efeito externo. A aplicação/deployment confiável reconcilia evidência autoritativa e chama `recover_pending_command` com a operação original e o resultado limitado. Reservas ativas, resolvidas, ausentes ou divergentes são rejeitadas. Falhas normais do handler libertam a reserva quando a remoção no store tem sucesso.

Efeito da aplicação, persistência do recibo e publicação de eventos são fronteiras separadas. Um crash entre recibo e publicação ainda pode perder a publicação. O EventBus limitado e o journal operacional opcional não são uma outbox transacional da aplicação. Para recuperação durável, grave efeito, resultado autoritativo e IDs estáveis dos eventos na transação/outbox da aplicação e deduplique consumidores. Não apague uma reserva pendente nem crie uma chave nova para contornar a incerteza.

## Admissão async

Correção ainda não publicada: admissão de execução e espera single-flight da carga do modelo suspendem com `futures_timer::Delay`, independente do executor; nenhuma usa espera Condvar na thread do router async. Mantêm-se os limites de fila, prioridade e vagas selecionadas. Descartar uma future na fila liberta a entrada e qualquer vaga selecionada. Cancelamento e deadline são verificados no intervalo configurado (carga de modelos: 10 ms), sem mutex através de await. O timer usa uma thread auxiliar partilhada, não um worker por pedido. Cada backend continua responsável pelo cancelamento cooperativo e por isolar o seu trabalho bloqueante. A regressão numa única thread cobre carga pendente com execução saturada e concorrência na admissão de carga.
