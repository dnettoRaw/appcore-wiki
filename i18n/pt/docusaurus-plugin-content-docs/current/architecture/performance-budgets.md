---
title: Budgets de Performance
sidebar_position: 8
---

# Budgets de Performance

O AppCore mantém um benchmark reproduzível entre subsistemas para que correções
de concorrência e persistência sejam medidas com as mesmas cargas V1.

```bash
appcore-dev cert bottlenecks
```

O comando em perfil release grava
`builds/certification/bottlenecks.json`. O relatório registra commit exato,
estado dirty, toolchain, sistema, arquitetura, p50/p95/p99, throughput, tempo
total e pico de memória residente. O CI Linux e Windows executa o mesmo gate e
publica o artefato JSON.

## Cargas fixas

- startup manifest-first e dispatch concorrente de commands e queries;
- enqueue, leitura e ACK da outbox perto de 1, 10 e 64 MiB;
- contenção do routing state do Gateway com 1, 100 e 1.000 tenants, mais uma
  prova de independência de lock entre tenants;
- 32 trocas HTTP/1.1 sequenciais por uma única conexão keep-alive aceita;
- encode, decode, integridade e replay do Peer RPC entre 1 KiB e 4 MiB;
- startup do scheduler e lotes limitados de 64 tasks vencidas.

As fixtures não contêm segredo estático. Cada execução obtém material secreto
temporário da fonte aleatória do sistema operacional.

## Uso dos budgets

Os limites portáveis impedem regressões em runners CI compartilhados. Eles não
são promessa de performance em produção. Cada correção deve preservar V1,
mostrar antes/depois, adicionar uma invariante de comportamento e apertar o
budget afetado quando o resultado estiver estável.

A baseline inicial registrou concorrência máxima `1` nos handlers de commands e
queries. AC-001 remove a execução de command handler do mutex compartilhado do
host. O gate agora exige sobreposição de pelo menos quatro entre oito workers;
testes determinísticos exigem que os oito entrem juntos, preservam execução
única para uma chave idempotente igual e verificam a drenagem no shutdown.
AC-002 também remove a execução de query endpoint do mutex do host e aplica o
mesmo gate de quatro entre oito. Seu teste determinístico congela o registro e
exige sobreposição das oito chamadas de endpoint.

AC-003 substitui o mapa global público de tenants do Gateway por um diretório
limitado com 32 shards e um lock por tenant. O gate mantém o write lock de um
tenant enquanto exige que o lock de outro continue disponível. Como manter o
mapa antigo restauraria a serialização ou duplicaria estado mutável, a correção
fica reservada ao próximo major SemVer e o campo antigo foi removido.

AC-004 remove o mutex global de metadata de requests pendentes. Um único mapa
privado e limitado por tenant guarda channel de resposta, geração do worker,
deadline e limite da resposta na mesma entrada. Testes determinísticos exigem
cleanup após resposta, resposta inválida, timeout, cancelamento, shutdown,
substituição e desconexão do worker; geração stale deve preservar a entrada
atual.

AC-005 adiciona um cliente HTTP reutilizável com admissão por origem, conexões
ociosas e retenção de origens limitadas. Os deadlines de conexão/admissão,
leitura e escrita são independentes. Somente respostas totalmente delimitadas e
interpretadas voltam ao pool; qualquer falha ou resposta não reutilizável
descarta o socket. O gate exige as 32 trocas pela mesma conexão aceita. O
adapter V1 livre `send` continua one-shot com `Connection: close`.

AC-007 substitui reload/rewrite integral da outbox pelo journal append-only V2
explícito no próximo major SemVer. As cargas de 1/10/64 MiB agora incluem um
pequeno enqueue incremental de tail limitado a 100 ms p99, enquanto ACK fica
limitado a 500 ms p99. A compactação atômica muda a geração; testes exigem
recovery do frame final incompleto e falha fechada para corrupção completa,
frames duplicados/reordenados e versões incompatíveis.

AC-011 adiciona índices diretos por tenant, Core ID e `(cluster_id, core_id)`.
O gate executa 16.384 lookups entre o máximo de 1.024 workers registrados e
exige no máximo 1 ms p99, pelo menos 10.000 lookups/s e zero inconsistências.
Testes de reconnect, disconnect e prune de heartbeat exigem que geração stale
nunca remova a entrada atual.

Veja o benchmark em [AC-022 pública](https://github.com/dnettoRaw/app-core-public/issues/24)
e a correção de commands em [AC-001 pública](https://github.com/dnettoRaw/app-core-public/issues/3).
A correção de queries está em [AC-002 pública](https://github.com/dnettoRaw/app-core-public/issues/4).
A correção do Gateway está em [AC-003 pública](https://github.com/dnettoRaw/app-core-public/issues/5).
O ownership de requests pendentes está em [AC-004 pública](https://github.com/dnettoRaw/app-core-public/issues/6).
O reuso de conexões HTTP está em [AC-005 pública](https://github.com/dnettoRaw/app-core-public/issues/7).
A correção do journal da outbox está em [AC-007 pública](https://github.com/dnettoRaw/app-core-public/issues/9).
O índice direto de workers está em [AC-011 pública](https://github.com/dnettoRaw/app-core-public/issues/13).
