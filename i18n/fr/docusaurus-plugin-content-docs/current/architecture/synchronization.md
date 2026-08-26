---
title: Sync, logs, checkpoints et replay
sidebar_position: 5
---

# Sync, logs, checkpoints et replay

Imaginez une boutique sans Internet pendant huit heures. L'opérateur continue à créer des devis. Quand le réseau revient, le runtime doit savoir ce qui a déjà été envoyé, ce qui est nouveau, ce qui est retry et ce qui est conflit.

Sync dans AppCore est une réplication conservative leader-to-follower. Ce n'est pas RAFT, multi-master ou un résolveur de conflits métier.

## Que se passe-t-il à la reconnexion ?

Quand la boutique perd Internet, les commands locales peuvent continuer selon la politique de storage et command. Quand le réseau revient, le receiver valide identité, protocole, séquence, count, taille, hash, previous hash et checkpoint.

Même séquence et même payload signifie retry. Même séquence et bytes différents signifie conflit.

```mermaid
flowchart LR
    LeaderLog[Log leader] --> Batch[SyncMessage]
    Batch --> Hash[Hash metadata + payload]
    Hash --> Receiver[Validation]
    Receiver --> FollowerLog[Log follower]
    FollowerLog --> Checkpoint[Checkpoint par peer]
```

Le log file-backed utilise `# appcore-replication-log-v1`, limite total, limite par record, sequence map, hash chain, lock et atomic write. Append par séquence est idempotent : même séquence/même payload retourne l'index original ; même séquence/payload différent est un conflit.

Le log est la preuve utilisée par replay. Sans lui, recovery devrait faire confiance aux projections applicatives, qui peuvent être compactées, migrées ou reconstruites partiellement.

## Pourquoi un checkpoint si replay existe ?

Checkpoint garde dernière séquence acceptée et batch hash par peer dans `# appcore-sync-checkpoint-v1`. Sans checkpoint, recovery devrait replay tout l'historique ou deviner depuis une projection.

## Comment l'outbox durable récupère-t-elle ?

L'outbox fichier de la prochaine version majeure utilise le marqueur binaire
explicite `appcore-sync-outbox-v2`. Chaque enqueue ou ACK ajoute et synchronise
une frame bornée. Les ordinaux, longueurs initiale/finale et une chaîne SHA-256
détectent corruption, duplication et réordonnancement. Seule une frame finale
incomplète est tronquée après un crash ; une frame complète invalide échoue de
manière fermée.

L'espace acquitté est récupéré par compaction atomique, qui écrit uniquement
les messages en attente et change la génération. Un autre processus avec une
vue ancienne détecte ce changement et recharge. Le journal reste limité à 64
MiB et réserve assez de tail pour acquitter le message frontal déjà accepté.

Il s'agit d'une frontière explicite de format persistant. Les fichiers V1, sans
version ou futurs retournent `NO MORE SUPPORTED PLEASE UPDATE` ; le Runtime ne
les déduit ni ne les convertit. Les opérateurs vident V1 avant la mise à niveau
et V2 avant un rollback.

Idempotency de command et idempotency de batch ne protègent pas la même frontière. La key de command évite de dupliquer un retry client. Séquence/checkpoint évitent de dupliquer une réplication peer.

## Limitations

- Sync est leader-to-follower, pas RAFT ni multi-master.
- AppCore détecte conflits sequence/hash, mais ne fusionne pas les changements métier.
- Checkpoint prouve le progrès accepté par le runtime, pas la correction d'une projection.
- Replay dépend de handlers respectant l'idempotency.
- Les outboxes fichier V1 et V2 ne sont pas mutuellement lisibles ; mise à
  niveau et rollback exigent une file durable vide.
- Les partitions réseau sont traitées prudemment ; les writes nécessitant leadership ne promettent pas disponibilité globale continue.

Suivant : [fonctionnement distribué](/architecture/distributed).
