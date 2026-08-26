---
title: appcore-gateway
sidebar_position: 18
---

# appcore-gateway

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-gateway/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-gateway/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-gateway)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-gateway/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** relay WebSocket isolado por tenant para conexoes Gateway
entre clients externos e workers AppCore.

**Dependencias internas:** contracts, types, security, distributed
contracts e peer RPC.

**API principal:** `GatewayConfig`, `GatewayState`, estado por tenant, registry
e resolver de capability, conexoes bounded de worker/client,
`MeshPeerTransport`, DTOs de request/response do mesh relay, pruner de
heartbeat e factory do router Axum. Contratos de content-envelope opaco são
reexportados para roteamento de payload cifrado.

> **Migração do próximo major:** o acesso direto a
> `GatewayState::tenants` foi removido para que tenants independentes não
> compartilhem um único lock. Use `tenant_partition`,
> `tenant_partition_or_insert`, `tenant_count` e `connection_count`. Os mapas
> de requests pendentes agora são privados; use `pending_request_count` para
> observação e deixe o `EnvelopeRouter` controlar seu ciclo. Esta
> mudança está reservada ao próximo major SemVer e não pode ser publicada como
> 1.0.x.

O gateway resolve o tenant pelo sufixo de dominio definido pelo deployment ou
por parametro de query usado em teste local, autentica conexoes quando
configurado, roteia envelopes Peer RPC e requests HTTP Peer RPC via mesh relay
somente dentro da particao do tenant e remove workers stale mantendo filas de
saida limitadas.

O caminho normal de ativacao no Runtime usa o mapa de adapters do Deployment
Manifest:

```toml
[adapters.gateway]
provider_id = "appcore-gateway"
settings = { bind_address = "127.0.0.1:8080", domain_suffix = "gateway.example.com", heartbeat_interval_ms = "30000", heartbeat_timeout_ms = "90000" }
secret_refs = {}
```

Modo cluster tambem exige `paths.gateway_replay` absoluto apontando para arquivo em
volume compartilhado e gravavel por todas as instancias Gateway.

O parser aceita apenas essas quatro settings sem segredo. Endpoints,
referencias de segredo, settings desconhecidas e overrides de autenticacao
falham fechados. `appcore-bin` inclui e autoriza o descriptor do owner
`runtime.gateway` no catalogo compartilhado, reutiliza a seguranca do Runtime e
registra a instancia como servico critico do Supervisor. Sem
`adapters.gateway`, nao existe runtime, listener ou task de Gateway.

Upgrades autenticados aceitam credencial apenas no header `Authorization`;
credenciais em query sao rejeitadas. Tokens de worker usam
`worker_connection_hash` para vincular tenant, cluster, installation, Core e
capabilities. Tokens de client usam `client_connection_hash` para vincular
tenant, cluster e device. Ambos sao tokens `peer` de uso unico, com `jti`, hash
do request e vida maxima de 60 segundos; o socket expira junto com o token.

O mesh relay valida schema V1, metadata de roteamento do Peer RPC interno,
digest do body e hash assinado antes de encaminhar. O payload da aplicacao
permanece opaco. Frames e mensagens aceitam no maximo 4 MiB; limites de tenant,
conexao, capability, request pendente, timeout, fila e roteamento concorrente
falham fechados. Heartbeat exige o JSON exato, e resposta de worker so e aceita
da geracao de conexao selecionada.

`mesh-relay` e um peer transport para Cores que mantem conexoes Gateway somente
de saida em vez de expor portas locais ou IPs estaveis. Ele nao e sistema de
consenso, terminador TLS publico ou gerenciador de segredos de producao. HA do
gateway, federacao de edge relays e transports alternativos continuam trabalho
futuro e nao podem enfraquecer autenticacao, expiry, nonce ou replay protection
do Peer RPC.

O host usa `FilePeerNonceStore` duravel e seguro entre processos: standalone o
mantem no storage privado, enquanto cluster falha fechado sem
`paths.gateway_replay` absoluto em arquivo compartilhado e gravavel. Sockets expiram em
no maximo 60 segundos. Embedders podem injetar outro `PeerNonceStore`; o default
deles e local e limitado. Rate limit por IP e terminacao TLS ficam no deployment.

`GatewayRuntime` possui listener, runtime Tokio current-thread, router, pruner
de heartbeat e thread. O startup faz bind sincronamente, portanto endereco
invalido ou ocupado aborta o host. O shutdown cooperativo limitado faz join de
todo o trabalho. Antes do prazo ele descarta o future do servidor, fechando
conexoes lentas ou incompletas antes do join da thread. `Orphaned` e apenas
quarentena defensiva de falha da thread. Snapshots seguros contem apenas
lifecycle, enderecos de bind e contadores. Usuarios
diretos de `spawn_heartbeat_pruner` devem guardar e aguardar o join handle.

Hashes de conexão de worker e client usam framing binário canônico V2 e levam
o marcador `v2:`. Hashes anteriores sem versão não são intercambiáveis;
emissores de token e consumidores Gateway devem ser atualizados juntos.

Cada tenant mantém índices diretos e limitados por Core ID e por
`(cluster_id, core_id)`. O lookup de roteamento é O(1); register, reconnect,
disconnect e prune de heartbeat atualizam mapa primário, registry de
capabilities e índices sob o mesmo lock do tenant. Contadores saturados de
rebuild e inconsistência expõem saúde sem labels ilimitadas.

## Alpha 2.0: telemetria limitada de roteamento

A linha alpha 2.0 expõe um snapshot pull neutro de fornecedor por
`GatewayMetrics::telemetry_snapshot` e uma fronteira explícita
`GatewayTelemetryExporter`. Ela registra outcomes fixos de rota, rotas
inflight/pico, saturação de fila, reconnects, retries, falhas de autenticação e
exportação, além de histogramas fixos de latência de rota, espera de worker,
espera de lock e payload. A cardinalidade é limitada a 128 séries de
capability; nomes validados adicionais são combinados na série fixa
`appcore.gateway.capability.overflow`. Tenant, conexão, request, token e
payload nunca viram labels.

O roteamento nunca chama um exporter. Adapters Prometheus ou OpenTelemetry do
deployment puxam o snapshot próprio e controlam fila, retry e policy de
transporte. Uma certificação limpa em perfil release no
[commit de implementação `31c4fbe`](https://github.com/dnettoRaw/AppCore-Runtime/commit/31c4fbec34d403770bf59dfe76d36732cb9b4450)
mediu 1.792 ns p99 para uma rota instrumentada sem worker disponível e 5.792 ns
p99 para um snapshot com 129 séries, contra budgets de 1 ms e 5 ms. Estas
medições são evidência local do repositório, não certificação de tráfego ou
collector em produção.

**Maturidade:** perfil estável de peer transport para a superfície distribuída V1.
