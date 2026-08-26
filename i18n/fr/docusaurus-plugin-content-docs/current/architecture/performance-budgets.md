---
title: Budgets de Performance
sidebar_position: 8
---

# Budgets de Performance

AppCore maintient un benchmark reproductible entre sous-systèmes afin que les
corrections de concurrence et de persistance utilisent les mêmes charges V1.

```bash
appcore-dev cert bottlenecks
```

La commande en profil release écrit
`builds/certification/bottlenecks.json`. Le rapport contient le commit exact,
l'état dirty, la toolchain, le système, l'architecture, p50/p95/p99, le débit,
le temps total et le pic de mémoire résidente. Le CI Linux et Windows exécute
le même gate et publie l'artefact JSON.

## Charges fixes

- startup manifest-first et dispatch concurrent des commands et queries ;
- enqueue, lecture et ACK de l'outbox près de 1, 10 et 64 MiB ;
- contention du routing state Gateway avec 1, 100 et 1 000 tenants ;
- encodage, décodage, intégrité et replay Peer RPC de 1 KiB à 4 MiB ;
- startup du scheduler et lots bornés de 64 tasks arrivées à échéance.

Les fixtures ne contiennent aucun secret statique. Chaque exécution obtient du
matériel secret temporaire depuis la source aléatoire du système d'exploitation.

## Utilisation des budgets

Les plafonds portables empêchent les régressions sur les runners CI partagés.
Ils ne constituent pas une promesse de performance en production. Chaque
correction doit préserver V1, fournir un avant/après, ajouter un invariant de
comportement et resserrer le budget concerné lorsque le résultat est stable.

La baseline initiale indiquait une concurrence maximale de `1` pour les
handlers de commands et queries. AC-001 retire l'exécution des command handlers
du mutex partagé du host. Le gate exige maintenant le chevauchement d'au moins
quatre workers sur huit ; les tests déterministes exigent l'entrée simultanée
des huit workers, préservent une seule exécution pour une clé idempotente
identique et vérifient le drainage au shutdown. AC-002 retire aussi l'exécution
des query endpoints du mutex du host et applique
le même gate de quatre workers sur huit. Son test déterministe gèle le registre
et exige le chevauchement des huit appels d'endpoint.

Suivez le benchmark dans [AC-022 public](https://github.com/dnettoRaw/app-core-public/issues/24)
et la correction des commands dans [AC-001 public](https://github.com/dnettoRaw/app-core-public/issues/3).
La correction des queries est suivie dans [AC-002 public](https://github.com/dnettoRaw/app-core-public/issues/4).
