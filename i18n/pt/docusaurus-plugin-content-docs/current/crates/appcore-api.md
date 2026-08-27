---
title: appcore-api
sidebar_position: 9
---

# appcore-api

:::info Pacote publicado
Estável **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-api/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-api/1.0.0) · [código-fonte](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-api)
:::

## Guia e exemplos mantidos pelo crate

O repositório do Runtime mantém o [guia detalhado](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/guide.pt.md), [exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/examples/basic.pt.md) e [exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-api/wiki/examples/intermediate.pt.md). O wiki resume a fronteira pública; detalhes de API e execução ficam junto ao código do crate.

**Responsabilidade:** host HTTP de command/query/status e DTOs de transporte.

**Dependências internas:** `appcore-core`, `appcore-security` e
`appcore-supervisor`.

**API principal:** `CommandRequest`/`CommandResponse`,
`QueryRequest`/`QueryResponse`, validation errors, `CommandEndpoint`,
`QueryEndpoint`, `ApiRouter`, `ApiRequest`/`ApiResponse`, `RuntimeHttpHost`,
`HttpApiConfig`, status estático, policy de capability para commands e queries
de aplicação, verificação de token e view do sync log.

Use para rotas do Runtime e queries registradas da aplicação. Não adicione
resources REST de produto ou schemas de negócio. O host novo normalmente
acessa pelo `appcore-bin`.

Queries de aplicação são autorizadas pela policy de capability composta antes
do router. Queries de status do Runtime permanecem fora do catálogo da
aplicação.

Na linha de manutenção 1.0 atual, hosts do Runtime congelam o registro de
queries do `ApiRouter` após o bootstrap. Snapshots do router compartilham
endpoints imutáveis por `Arc`; facade direta, HTTP e peer RPC liberam o mutex do
estado do host antes de chamar o endpoint. Queries independentes executam em
paralelo, e registro tardio falha com `router_frozen`.

O limite configurado aplica-se ao corpo HTTP completo antes de o Axum
desserializar o JSON. Rotas protegidas aceitam exatamente um header
`Authorization` bearer bem formado; duplicatas falham de forma fechada.

`HttpCommandAuth::default()` exige autenticação e falha fechado até que um
verificador de token seja configurado. Apenas
`insecure_local_for_testing()` desativa explicitamente a autenticação de
command/query para testes locais controlados. `/v1/health` permanece público
por contrato. Rejeições de autorização de command geram audit com metadados
normalizados, sem credenciais, payload ou chave de idempotência.

## Prerelease 1.5: reload coordenado de routing

A linha candidata 1.5 adiciona o `ReloadableRuntimeHttpHost` opt-in ainda não
publicado. Um candidato deve usar geração estritamente mais nova no mesmo
endereço ligado e passar por `/v1/health` antes e depois de uma troca atômica de
routing. Requests já aceitos mantêm o Router original até a conclusão; a
geração anterior é drenada com prazo. Falha de saúde ou drain restaura a geração
anterior e fecha a admissão da geração com falha.

O ponteiro ativo é lock-free, prazos são limitados a 60 segundos e o snapshot
contém apenas contadores de geração, in-flight, sucesso, falha e rollback. A
composition root pode transferir um listener TCP já ligado para validar o bind
antes do startup. Mudanças de endereço exigem outra geração de listener
preparada e não são inferidas.

Esta API descreve apenas o status do source. Não presuma que ela esteja
disponível no pacote estável `1.0.0` indicado acima. Veja
[reload coordenado](/pt/architecture/reload).

**Maturidade:** superfície HTTP V1 estrita e estável.
