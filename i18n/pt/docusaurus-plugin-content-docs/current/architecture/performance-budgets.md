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

A baseline inicial registra concorrência máxima `1` nos handlers de commands e
queries. Isso comprova a serialização global conhecida; não representa o
comportamento final desejado.

Veja o acompanhamento em [AC-022 pública](https://github.com/dnettoRaw/app-core-public/issues/24).
