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
- contenção do routing state do Gateway com 1, 100 e 1.000 tenants;
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

Veja o benchmark em [AC-022 pública](https://github.com/dnettoRaw/app-core-public/issues/24)
e a correção de commands em [AC-001 pública](https://github.com/dnettoRaw/app-core-public/issues/3).
A correção de queries está em [AC-002 pública](https://github.com/dnettoRaw/app-core-public/issues/4).
