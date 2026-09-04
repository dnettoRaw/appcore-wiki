---
title: Sync, logs, checkpoints et replay
sidebar_position: 5
---

# Sync, logs, checkpoints et replay

Imaginez une boutique sans Internet pendant huit heures. L'opérateur continue à créer des devis. Quand le réseau revient, le runtime doit savoir ce qui a déjà été envoyé, ce qui est nouveau, ce qui est retry et ce qui est conflit.

Le Runtime doit répondre :

- quels records ont été envoyés avant la coupure ;
- quels records sont nouveaux ;
- si un renvoi est un retry ou un payload conflictuel ;
- si le batch accepté précédent correspond à la chain du sender ;
- où reprendre le replay après un crash.

Sync dans AppCore est une réplication conservative leader-to-follower. Ce n'est pas RAFT, multi-master ou un résolveur de conflits métier.

## Que se passe-t-il à la reconnexion ?

Quand la boutique perd Internet, les commands locales peuvent continuer selon la politique de storage et command. Quand le réseau revient, le receiver valide identité, protocole, séquence, count, taille, hash, previous hash et checkpoint.

Le receiver vérifie :

- compatibilité de l'identité source ;
- plage de sequence ;
- nombre d'événements déclaré ;
- taille du payload ;
- SHA-256 des événements ;
- hash du batch précédent ;
- sequences rejouées ;
- état du checkpoint.

Même séquence et même payload signifie retry. Même séquence et bytes différents signifie conflit.

## Que prouve un SyncMessage ?

Un batch contient `batch_id`, source node, plage de séquences, nombre
d'événements, hash des metadata et payloads préfixés par leur taille, timestamp,
previous batch hash facultatif et payloads opaques. Il prouve l'ordre et
l'intégrité du transport, pas la correction sémantique métier.

- `batch_id` comme identité idempotente ;
- source node ID ;
- `sequence_start` et `sequence_end` inclusifs ;
- nombre d'événements déclaré ;
- hash des metadata et payloads préfixés par leur taille ;
- creation time ;
- hash facultatif du batch précédent ;
- payloads opaques des événements.

```mermaid
flowchart LR
    LeaderLog[Log leader] --> Batch[SyncMessage]
    Batch --> Hash[Hash metadata + payload]
    Hash --> Transport[Transport]
    Transport --> Receiver[Validation]
    Receiver --> FollowerLog[Log follower]
FollowerLog --> Checkpoint[Checkpoint par peer]
```

## Pourquoi conserver un replication log ?

Le log file-backed utilise `# appcore-replication-log-v1`, limite total, limite par record, sequence map, hash chain, lock et atomic write. Append par séquence est idempotent : même séquence/même payload retourne l'index original ; même séquence/payload différent est un conflit.

Il :

- utilise le marqueur stable `# appcore-replication-log-v1` ;
- borne le nombre total d'octets ;
- borne les octets de chaque record ;
- stocke sequence et metadata de hash chain ;
- recharge et valide les records avant append ;
- utilise process locks et writes atomiques ;
- récupère un préfixe valide si la tail est interrompue.

Le log est la preuve utilisée par replay. Sans lui, recovery devrait faire confiance aux projections applicatives, qui peuvent être compactées, migrées ou reconstruites partiellement.

## Pourquoi un checkpoint si replay existe ?

Checkpoint garde dernière séquence acceptée et batch hash par peer dans `# appcore-sync-checkpoint-v1`. Sans checkpoint, recovery devrait replay tout l'historique ou deviner depuis une projection.

```text
# appcore-sync-checkpoint-v1
peer-a=42,2f4c...
peer-b=17,
```

## Comment l'outbox durable récupère-t-elle ?

L'outbox fichier de la version candidate `1.0.2-rc` utilise le marqueur binaire
explicite `appcore-sync-outbox-v2`. Chaque enqueue ou ACK ajoute et synchronise
une frame bornée. Les ordinaux, longueurs initiale/finale et une chaîne SHA-256
détectent corruption, duplication et réordonnancement. Seule une frame finale
incomplète est tronquée après un crash ; une frame complète invalide échoue de
manière fermée.

L'espace acquitté est récupéré par compaction atomique, qui écrit uniquement
les messages en attente et change la génération. Un autre processus avec une
vue ancienne détecte ce changement et recharge. Le journal reste limité à 64
MiB et réserve assez de tail pour acquitter le message frontal déjà accepté.

Le contrat outbox de la version candidate `1.0.2-rc` lit un préfixe ordonné avec
des limites indépendantes de nombre et d'octets encodés avant de cloner les
payloads. Il expose des stats sans payload, persiste les attempts/readiness
retry et applique uniquement des receipts de préfixe ordonné exact. Le follower
et la CLI Runtime utilisent directement ce chemin : la croissance de la file
ne détermine ni une allocation unique de livraison ni le progrès du checkpoint.

Il s'agit d'une frontière explicite de format persistant. Les fichiers V1, sans
version ou futurs retournent `NO MORE SUPPORTED PLEASE UPDATE` ; le Runtime ne
les déduit ni ne les convertit. Les opérateurs vident V1 avant la mise à niveau
et V2 avant un rollback.

## Qu'est-ce qui rend le replay sûr ?

Le replay n'est sûr que si handlers et logs sont idempotents à la bonne
frontière. L'idempotency de command évite de dupliquer un retry client ; celle
du batch, sa séquence et son checkpoint évitent une réplication peer en double.
Même séquence avec d'autres bytes reste un conflit, jamais un retry.

## Persistance SQLite facultative après la 1.0

L'aperçu post-1.0 publié `appcore-sync-sqlite 0.1.0-alpha.4` persiste uniquement les enregistrements
de synchronisation du Runtime : replication log, outbox, checkpoints par peer
et tombstones opaques. Il utilise un schéma interne versionné, WAL,
synchronisation complète, connexions et limites bornées, snapshots portables,
sauvegarde en ligne vérifiée et contrôle d'intégrité fermé en cas d'échec. Il
n'expose jamais de SQL arbitraire ni de tables applicatives.

Le provider accepte des processus locaux indépendants sur un filesystem au
locking fiable. Les partages réseau, SQLite multi-host et la sélection
automatique par le manifest V1 stable sont hors contrat. Un schéma interne
inconnu ou futur retourne `NO MORE SUPPORTED PLEASE UPDATE` ; aucun format du
file provider n'est importé par inférence. Voir
[l'aperçu `appcore-sync-sqlite`](../crates/appcore-sync-sqlite).

## Pourquoi AppCore ne résout-il pas automatiquement les conflits ?

La réplication multi-master exige un modèle de conflit métier. Le Runtime ne
peut pas savoir si réserver du stock, modifier une note, approuver un devis et
faire tourner un secret partagent la même sémantique. Sync reste donc
conservateur et l'application possède la policy des conflits métier.

## Limites

- Sync est leader-to-follower, pas RAFT ni multi-master.
- AppCore détecte conflits sequence/hash, mais ne fusionne pas les changements métier.
- Checkpoint prouve le progrès accepté par le runtime, pas la correction d'une projection.
- Replay dépend de handlers respectant l'idempotency.
- Les outboxes fichier V1 et V2 ne sont pas mutuellement lisibles ; mise à
  niveau et rollback exigent une file durable vide.
- Les partitions réseau sont traitées prudemment ; les writes nécessitant leadership ne promettent pas disponibilité globale continue.

Suivant : [fonctionnement distribué](/fr/architecture/distributed).
