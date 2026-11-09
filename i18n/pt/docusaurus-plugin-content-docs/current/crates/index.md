---
title: Catálogo de crates
sidebar_position: 0
slug: /crates/
---

# Catálogo de crates

AppCore-Runtime contém 31 crates públicos ativos. Cada pacote possui SemVer
independente e uma camada explícita. O release de um crate não obriga crates não
relacionados a mudar de versão.

Comece aplicações com [`appcore-sdk`](/pt/crates/appcore-sdk). Dependa de um
crate de baixo nível somente quando precisar diretamente daquele contrato.

## Links estáveis da documentação

Cada crate possui um ID permanente entre ACR-001 e ACR-031. Use essas URLs em
READMEs, issues, releases e documentação externa:

```text
https://wiki.appcore.dnettoraw.com/pt/crates/id/acr-028
```

O ID redireciona para a página atual mesmo se o slug mudar. IDs nunca são
reutilizados. Consulte o [registro completo](./registry).

## Camadas

| Camada | Responsabilidade | Crates |
|---|---|---|
| Standalone | Bibliotecas genéricas e limitadas sem dependência AppCore | `appcore-args`, `appcore-supervisor`, `appcore-transport` |
| Contrato | Manifestos, identidades, formatos wire e providers versionados | `appcore-contracts`, `appcore-types`, `appcore-distributed-contracts`, `appcore-provider` |
| Runtime | Lifecycle, segurança, dados, coordenação, observabilidade, AI e documentos | `appcore-core`, `appcore-api`, `appcore-dnt`, `appcore-security`, `appcore-storage`, `appcore-sync`, `appcore-ops`, `appcore-log`, `appcore-scheduler`, `appcore-control-plane`, `appcore-capabilities`, `appcore-peer-rpc`, `appcore-update`, `appcore-ai`, `appcore-filemaker`, `appcore-ui` |
| Integração | Adapters explícitos para infraestrutura externa ou opcional | `appcore-gateway`, `appcore-provider-vercel-neon`, `appcore-sync-sqlite`, `appcore-transfer` |
| Adapter | Interfaces opcionais de desenvolvimento/modelo ao redor de um core determinístico | `appcore-filemaker-ai`, `appcore-filemaker-cli` |
| Fachada | Limite de composição voltado para aplicações | `appcore-sdk` |

O grafo permanece acíclico. Contratos não dependem de implementações e crates
standalone não dependem do AppCore. Crates prerelease nunca entram
silenciosamente em deployments estáveis.

## Ownership da documentação

Cada README deve explicar:

- o que o crate possui e deliberadamente não possui;
- quando um consumer deve selecioná-lo;
- seus contratos públicos e o menor exemplo útil;
- limites importantes de recursos, segurança e falha;
- como executar testes e exemplos focados;
- onde seu ID estável leva para orientação adicional de arquitetura.

Guias e exemplos específicos ficam em `crates/<nome>/wiki`; arquitetura e
operação compartilhadas ficam nesta wiki pública.

Páginas históricas como `appcore-bin`, `appcore-filemaker-yaml`
não são entradas ativas do catálogo.

`appcore-transfer`: Integration · 0.1.0-beta.1 — crates.io.

:::info Release candidate
Candidatos independentes **`1.0.X-rc.N`** — publicados no crates.io em 2026-10-15. Selecionar a versão exata de cada crate. Esta rodada RC não substitui pacotes estáveis anteriores nem certifica um deployment.
:::
