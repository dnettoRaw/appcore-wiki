---
title: appcore-sync
sidebar_position: 12
---

# appcore-sync

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-sync/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-sync/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-sync)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-sync/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** réplication leader-to-follower conservatrice et helpers de
durabilité locale.

**Dépendances internes :** `appcore-core`,
`appcore-distributed-contracts`, `appcore-ops`, `appcore-transport`.

**API principale :** node role/status/peer/heartbeat et `SyncMessage`; codec
wire V1; replication logs/snapshots; checkpoints et outbox mémoire/fichier;
receiver state/ack; follower client; transport HTTP; peer discovery; retry,
métriques et `SyncError`.
Les contrats content-envelope opaque sont réexportés pour les paquets sync
basés sur DNT sans exposer le plaintext au code de routage.

`HttpSyncTransport` possède un client HTTP réutilisable et borné. Utilisez
`with_timeout_ms` pour le délai V1 uniforme ou `with_timeouts` pour des délais
indépendants de connexion/admission, de lecture et d'écriture.

À utiliser pour réplication compatible, ordonnée et hash-chaînée. Ne pas
contourner identité/protocole ni l'interpréter comme RAFT, multi-master ou
résolution de conflits métier.

Le log fichier est limité à 256 MiB et l'outbox à 64 MiB. Les identifiants peer
et hashes de checkpoint sont validés à l'écriture et à la lecture. Le receiver
valide tout le batch, l'arithmétique de sequence et chaque limite de record
avant toute mutation du log ou checkpoint; un événement final invalide ne
laisse pas d'append partiel.

:::warning Mise à jour de l'outbox dans la prochaine version majeure
Dans la prochaine version majeure, `FileSyncOutbox` accepte uniquement le
journal binaire explicite `appcore-sync-outbox-v2`. Les fichiers V1, sans
version ou futurs échouent avec `NO MORE SUPPORTED PLEASE UPDATE` ; aucune
conversion automatique n'existe. Videz V1 avant la mise à niveau et V2 avant
un rollback. Enqueue et ACK ajoutent et synchronisent alors une frame chaînée
par intégrité sans réécrire le fichier complet.
L'extension additive de pagination fournit `peek`, des `stats` sans payload,
`mark_attempt` persistant, `next_ready` et des receipts partiels de préfixe
exact. Les nouveaux consommateurs utilisent `pending_page`, `outbox_stats` et
`flush_pending_with_progress` ; le wire peer V1 reste inchangé.
:::

**Maturité :** profil conservateur stable avec décodage V1 strict.
