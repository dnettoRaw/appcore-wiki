---
title: Capacités des Providers Storage
sidebar_position: 11
---

# Preflight des capacités des providers storage

Le descriptor V1 post-1.0 sépare les exigences portables de l'implémentation.
Il contient sept garanties fermées: `transactions`, `locking`, `snapshot`,
`streaming`, `online_backup`, `multi_process` et `multi_host`. Un catalogue
admet au maximum 32 descriptors.

Les deployments activent le contrat via le setting provider existant:

```toml
[storage]
provider_id = "file"
settings = { required_capabilities = "snapshot" }
secret_refs = {}
```

La déclaration existante `storage.shared=true` exige `multi_host`. Toute
exigence inconnue, dupliquée, indisponible ou non supportée échoue avant le
startup avec une erreur typée et redigée. Aucun fallback de provider ou de
sémantique.

Le provider fichier annonce seulement `snapshot`. Le remplacement atomique et
le lock interne ne sont pas annoncés comme transactions, locking visible par
l'appelant, streaming, backup en ligne, multi-processus ou multi-hôte. Cette
frontière conservative précède les providers SQLite sync et scheduler durable.
Les schémas métier restent la propriété de l'application.

Ce contrat en développement ne modifie pas les manifests V1 publiés. Toute
sémantique incompatible future exige une autre version. Un rollback retire les
exigences opt-in seulement après preuve des mêmes garanties dans l'ancien host.

La certification release clean-source à `12cbfc3` a exécuté 16 384 preflights
avec p50/p95 de 42 ns, p99 de 83 ns et 10 493 879 opérations/s. Les exigences
non supportées ont échoué fermées et la suite est restée sous le budget RSS.
