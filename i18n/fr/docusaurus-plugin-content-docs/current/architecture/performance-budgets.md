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
le temps total et le pic de mémoire résidente. Il compte aussi les octets
demandés au heap Rust, les opérations d'allocation/désallocation, le pic vivant
et la rétention par sous-système. Le CI Linux et Windows exécute le même gate et
publie l'artefact JSON.

Le RSS reste obligatoire car les compteurs Rust excluent les métadonnées de
l'allocator, les bibliothèques natives, les memory mappings, les buffers kernel
et la mémoire des devices. La saturation des compteurs échoue fermée. Chaque
workload fixe est limité à 64 Mio de delta de heap vivant et 4 Mio de croissance
retenue ; le processus complet conserve les plafonds de catastrophe RSS et heap
plus larges. La première calibration release Apple M1 a observé un pic vivant
de 29 476 637 octets et 139 611 octets de croissance retenue du heap Rust.

Peer RPC rapporte des intervalles d'allocation séparés pour V1, le stream V2,
les codecs V2 et les erreurs typées. Le base64 JSON avec scratch fixe et le
décodage emprunté ont réduit les octets demandés de 8,75 % sur le workload
complet, 7,20 % sur le stream V2 et 21,36 % sur les codecs dans des runs
appariés Apple M1. Le pic et le heap retenu ne changent pas; les opérations
d'allocation augmentent de 5,44 % et le p99 stream de 1,69 %, donc le rapport
conserve ce compromis sans confondre churn et mémoire résidente.
Le transfert d'ownership des chunks identity entre encoder, frame et assembler
a réduit les octets demandés par le stream de 64 Mio de 1 072 617 252 à
938 399 524 (-12,51 %) et les allocations de 7,39 %, avec +0,22 % au p99 et
-0,21 % au RSS de pic du processus. Le workload fixe échoue maintenant au-delà
Ce checkpoint d'ownership échouait au-delà de 960 Mio demandés cumulativement.
L'attribution par phase a ensuite montré 662 732 479 octets demandés pendant
l'encodage. Une sonde fixe d'incompressibilité sur stack a réduit le total du
stream de 938 404 175 à 342 886 735 (-63,57 %) et les allocations de 47,83 %.
Deux runs de la sonde complète ont amélioré le p99 de 15,38 à 16,14 %, tout en
gardant gzip pour les fixtures compressibles. Le gate est maintenant de 384 Mio.

SQLite rapporte des intervalles d'allocation séparés pour startup, append,
lecture ponctuelle, construction des fixtures, enqueue outbox, backup et
integrity check. L'enqueue de 512 petits records est borné à 2 Mio demandés au
heap Rust et 250 ms p99. Le scratch ajusté du BLOB incrémental a réduit les
octets demandés par le workload complet de 578 081 344 à 8 251 670 (-98,57 %)
et le delta de heap vivant de 1 083 528 à 233 600 octets (-78,44 %) ; l'enqueue
a demandé 255 676 octets, sans croissance retenue, et mesuré 141 791 ns p99.

## Charges fixes

- startup manifest-first et dispatch concurrent des commands et queries ;
- enqueue, lecture et ACK de l'outbox près de 1, 10 et 64 MiB, plus comparaison
  de matérialisation entre snapshot complet et page bornée sur 256 messages ;
- contention du routing state Gateway avec 1, 100 et 1 000 tenants, plus une
  sonde d'indépendance des verrous entre tenants ;
- 32 échanges HTTP/1.1 séquentiels sur une seule connexion keep-alive acceptée ;
- encodage, décodage, intégrité et replay JSON/base64 et binaire/natif Peer RPC
  de 1 KiB à 4 MiB, plus 4 096 round trips de rejet V2 typé ;
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
l'état mutable ; cette correction reste donc bloquée dans le RC jusqu'au rétablissement de la compatibilité 1.x et
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
V2 explicite dans la version candidate `1.0.2-rc`. Les charges de 1/10/64
MiB incluent désormais un petit enqueue incrémental du tail limité à 100 ms p99,
tandis que l'ACK est limité à 500 ms p99. La compaction atomique change la
génération ; les tests exigent la récupération d'une frame finale incomplète et
un échec fermé pour corruption complète, frames dupliquées/réordonnées et
versions incompatibles.

AC-011 ajoute des index directs par tenant, Core ID et `(cluster_id, core_id)`.
Le gate effectue 16 384 lookups parmi le maximum de 1 024 workers enregistrés
et exige au plus 1 ms p99, au moins 10 000 lookups/s et zéro incohérence. Les
tests reconnect, disconnect et prune heartbeat exigent qu'une génération stale
ne supprime jamais l'entrée actuelle.

AC-018 remplace un thread par exécution du scheduler par un pool fixe et une
file bornée. Le gate de 64 tasks exige que la concurrence des callbacks et les
noms distincts des threads workers restent dans `max_concurrent_tasks`, tout en
observant au moins un événement borné de saturation de la file. Le travail
excédentaire est différé sans consommer de tentatives de retry.

AC-020 ajoute le contrat de télémétrie Gateway de `1.0.2-rc`. Le gate conserve
128 séries de capability, agrège huit noms supplémentaires dans une série
d'overflow fixe, exécute 4 096 routes instrumentées sans worker disponible et
construit 256 snapshots. Il exige zéro route inflight résiduelle, une
cardinalité et un overflow exacts, un p99 de route inférieur ou égal à 1 ms et
un p99 de snapshot inférieur ou égal à 5 ms. L'exécution propre macOS/aarch64
au commit d'implémentation `31c4fbe` a mesuré 1 792 ns p99 pour la route et
5 792 ns p99 pour le snapshot. L'export est une frontière pull explicite du
deployment et n'est jamais appelé par le routage.

AC-021 valide la matrice complète des erreurs typées, le décodage V1 exact et
4 096 round trips encode/décode/validation d'un rejet V2. Le gate exige un p99
d'au plus 1 ms et au moins 1 000 opérations/s. Le run macOS/aarch64 propre à
`d11befe` a mesuré 750 ns p99 et 1 405 708 opérations/s, avec un pic RSS total
de 298 672 KiB. Les artefacts CI Linux et Windows restent l'autorité plateforme.

AC-012 remplace la sélection aléatoire par processus par les policies stables
`FirstAvailable`, `RoundRobin`, `LeastInflight`, `HealthWeighted` et `Affinity`
stateless. Le gate enregistre 64 workers, exige exactement quatre sélections
round-robin par worker, vérifie les invariants health, capacity et affinity, et
exécute 16 384 sélections par policy mesurée. Chaque policy est plafonnée à
1 ms p99 et doit dépasser 10 000 sélections/s. L'exécution finale propre
macOS/aarch64 au `7caddc1` a mesuré 17 125 ns p99 pour round-robin, 18 542 ns
pour least-inflight et 38 083 ns pour affinity.

AC-013 ajoute 4 096 lookups du registre partagé et trois rounds complets de
recovery avec 1, 100 et 1 000 tenants, puis 64 requests réussies dans chaque
route fenced locale réelle et route fédérée V2 authentifiée. Le lookup est
plafonné à 5 ms p99 et doit dépasser 500/s; le recovery est plafonné à 5 s; la
route locale à 50 ms p99 et 100/s; la fédération à 250 ms p99 et 20/s. Le run
macOS/aarch64 propre à `7197416` a mesuré au plus 667 ns p99 de lookup, 2,25 ms
p99 de recovery, 0,35 ms p99 de route locale et 0,91 ms p99 de route fédérée.
Les tests Redis, proxy externe et perte d'owner restent des preuves séparées;
les artefacts Linux et Windows restent requis.

AC-014 ajoute une représentation binaire opt-in explicite aux DTO Peer RPC V2
existants tout en préservant les fixtures JSON/base64 exactes et toutes les
routes V1. Le gate exige que les octets du body binaire restent à 80 % ou moins
du JSON, que le p99 du codec binaire ne dépasse pas celui du JSON et que le
buffer borné reste à 90 % ou moins du JSON. Le run macOS/aarch64 propre à
`6f3bc38` a mesuré 25 % d'octets body en moins, un p99 codec réduit de 93 % et
un buffer réduit de 14 % entre 64 Kio et 4 Mio; le pic RSS total était de
306 448 Kio. L'absence du support binaire échoue sans retry JSON. Les artefacts
Linux et Windows restent requis.

AC-015 ajoute des pages outbox bornées par nombre/octets, des stats sans
payload, une readiness retry durable et des receipts partiels exacts. Le
follower et la CLI Runtime ne matérialisent plus toute la file. L'exécution
propre macOS/aarch64 au commit `c904e83` a matérialisé 460 684 octets pour une
page de sept messages contre 30 021 820 octets pour le snapshot complet de 256
messages, soit 98,46 % de réduction. Le p99 de page était de 71 458 ns contre
1 404 417 ns ; le p99 des stats était de 54 542 ns et le pic RSS total de
244 752 Kio. Le wire peer V1 reste inchangé ; les artefacts Linux et Windows
restent requis.

Suivez le benchmark dans [AC-022 public](https://github.com/dnettoRaw/app-core-public/issues/24)
et la correction des commands dans [AC-001 public](https://github.com/dnettoRaw/app-core-public/issues/3).
La correction des queries est suivie dans [AC-002 public](https://github.com/dnettoRaw/app-core-public/issues/4).
La correction Gateway est suivie dans [AC-003 public](https://github.com/dnettoRaw/app-core-public/issues/5).
L'ownership des requests en attente est suivi dans [AC-004 public](https://github.com/dnettoRaw/app-core-public/issues/6).
La réutilisation des connexions HTTP est suivie dans [AC-005 public](https://github.com/dnettoRaw/app-core-public/issues/7).
La correction du journal outbox est suivie dans [AC-007 public](https://github.com/dnettoRaw/app-core-public/issues/9).
L'index direct des workers est suivi dans [AC-011 public](https://github.com/dnettoRaw/app-core-public/issues/13).
Le pool fixe du scheduler est suivi dans [AC-018 public](https://github.com/dnettoRaw/app-core-public/issues/20).
La télémétrie Gateway bornée est suivie dans [AC-020 public](https://github.com/dnettoRaw/app-core-public/issues/22).
La sélection bornée des workers est suivie dans [AC-012 public](https://github.com/dnettoRaw/app-core-public/issues/14).
La HA Gateway est suivie dans [AC-013 public](https://github.com/dnettoRaw/app-core-public/issues/15).
Le framing binaire Peer RPC est suivi dans [AC-014 public](https://github.com/dnettoRaw/app-core-public/issues/16).
La pagination outbox bornée est suivie dans [AC-015 public](https://github.com/dnettoRaw/app-core-public/issues/17).
Les artefacts plateforme restants de l'erreur wire typée sont suivis dans [AC-021 public](https://github.com/dnettoRaw/app-core-public/issues/23).
