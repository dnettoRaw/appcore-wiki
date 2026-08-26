---
title: Capacidades de Providers de Storage
sidebar_position: 11
---

# Preflight de capacidades de providers de storage

O descriptor V1 pós-1.0 separa requisitos portáveis da implementação. Ele tem
sete garantias fechadas: `transactions`, `locking`, `snapshot`, `streaming`,
`online_backup`, `multi_process` e `multi_host`. Um catálogo admite no máximo
32 descriptors.

Deployments ativam o contrato pelo setting existente do provider:

```toml
[storage]
provider_id = "file"
settings = { required_capabilities = "snapshot" }
secret_refs = {}
```

A declaração existente `storage.shared=true` exige `multi_host`. Requisitos
desconhecidos, duplicados, indisponíveis ou não suportados falham antes do
startup com erros tipados e redigidos. Não existe fallback de provider ou
semântica.

O provider de arquivo anuncia somente `snapshot`. Replacement atômico e lock
interno não são anunciados como transactions, locking visível ao caller,
streaming, backup online, multi-process ou multi-host. Essa fronteira
conservadora é pré-requisito para SQLite sync e scheduler durável. Schemas de
negócio continuam pertencendo à aplicação.

O contrato em desenvolvimento não altera manifests V1 publicados. Significados
incompatíveis futuros exigem outra versão. Rollback só remove requisitos opt-in
depois de provar as mesmas semânticas no host e provider anteriores.

A certificação release clean-source em `12cbfc3` executou 16.384 preflights com
p50/p95 de 42 ns, p99 de 83 ns e 10.493.879 operações/s. Requisitos não
suportados falharam fechados e a suíte completa ficou abaixo do budget de RSS.
