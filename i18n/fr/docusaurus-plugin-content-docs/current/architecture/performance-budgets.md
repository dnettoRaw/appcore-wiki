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
- contention du routing state Gateway avec 1, 100 et 1 000 tenants, plus une
  sonde d'indépendance des verrous entre tenants ;
- 32 échanges HTTP/1.1 séquentiels sur une seule connexion keep-alive acceptée ;
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

AC-003 remplace la map publique globale des tenants Gateway par un répertoire
borné de 32 shards et un verrou par tenant. Le gate conserve le verrou
d'écriture d'un tenant tout en exigeant que celui d'un autre tenant reste
disponible. Conserver l'ancienne map rétablirait la sérialisation ou dupliquerait
l'état mutable ; cette correction est donc réservée au prochain major SemVer et
l'ancien champ est supprimé.

AC-004 supprime le mutex global des métadonnées de requests en attente. Une map
privée et bornée par tenant conserve le channel de réponse, la génération du
worker, la deadline et la limite de réponse dans la même entrée. Les tests
déterministes exigent le cleanup après réponse, réponse invalide, timeout,
annulation, shutdown, remplacement et déconnexion du worker ; une génération
stale doit préserver l'entrée actuelle.

AC-005 ajoute un client HTTP réutilisable avec admission par origine,
connexions inactives et rétention des origines bornées. Les délais de
connexion/admission, de lecture et d'écriture sont indépendants. Seules les
réponses entièrement cadrées et analysées reviennent au pool ; tout échec ou
toute réponse non réutilisable élimine le socket. Le gate exige les 32 échanges
sur la même connexion acceptée. L'adaptateur V1 libre `send` reste one-shot avec
`Connection: close`.

AC-007 remplace le reload/rewrite complet de l'outbox par le journal append-only
V2 explicite dans la prochaine version majeure SemVer. Les charges de 1/10/64
MiB incluent désormais un petit enqueue incrémental du tail limité à 100 ms p99,
tandis que l'ACK est limité à 500 ms p99. La compaction atomique change la
génération ; les tests exigent la récupération d'une frame finale incomplète et
un échec fermé pour corruption complète, frames dupliquées/réordonnées et
versions incompatibles.

Suivez le benchmark dans [AC-022 public](https://github.com/dnettoRaw/app-core-public/issues/24)
et la correction des commands dans [AC-001 public](https://github.com/dnettoRaw/app-core-public/issues/3).
La correction des queries est suivie dans [AC-002 public](https://github.com/dnettoRaw/app-core-public/issues/4).
La correction Gateway est suivie dans [AC-003 public](https://github.com/dnettoRaw/app-core-public/issues/5).
L'ownership des requests en attente est suivi dans [AC-004 public](https://github.com/dnettoRaw/app-core-public/issues/6).
La réutilisation des connexions HTTP est suivie dans [AC-005 public](https://github.com/dnettoRaw/app-core-public/issues/7).
La correction du journal outbox est suivie dans [AC-007 public](https://github.com/dnettoRaw/app-core-public/issues/9).
