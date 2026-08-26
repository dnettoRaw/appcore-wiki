---
title: appcore-sync-sqlite
sidebar_position: 23
---

# appcore-sync-sqlite

:::warning Alpha publiée
Post-1.0 **`0.1.0-alpha.2`** ·
[crates.io](https://crates.io/crates/appcore-sync-sqlite/0.1.0-alpha.2) ·
[docs.rs](https://docs.rs/crate/appcore-sync-sqlite/0.1.0-alpha.2) ·
[code source public](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-sync-sqlite) ·
non sélectionnable par le manifest V1 gelé et non enregistré par `appcore-bin`.
:::

**Responsabilité :** persistance SQLite facultative et bornée pour l'état de
synchronisation du Runtime. Elle implémente les contrats replication log,
outbox et checkpoint et possède tombstones opaques, restauration de snapshot
portable, inspection d'intégrité et sauvegarde en ligne. Elle n'expose ni SQL
arbitraire ni schémas applicatifs.

**Dépendances AppCore directes :** `appcore-sync`, `appcore-storage`.

La documentation du crate est disponible dans le
[guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/guide.fr.md),
[exemple débutant](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/examples/basic.fr.md) et
[exemple intermédiaire](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-sync-sqlite/wiki/examples/intermediate.fr.md),
avec les variantes anglaise et portugaise à côté.

Le provider utilise un schéma interne V1 fixe, WAL, `synchronous=FULL`, un pool
de connexions borné et les limites runtime de SQLite. Un schéma inconnu,
supprimé ou futur échoue avec `NO MORE SUPPORTED PLEASE UPDATE`. Sauvegarde et
restauration ne publient que de nouveaux fichiers vérifiés ; la restauration
ne remplace jamais une database active.

Les garanties déclarées sont transactions, locking, snapshot, sauvegarde en
ligne et fonctionnement multiprocessus sur un filesystem local. Streaming,
multi-host et partages réseau ne sont pas garantis.

:::warning Prochaine mise à jour prerelease du schéma
La branche de développement fait évoluer la database interne vers le schéma
V2. Elle ajoute des compteurs d'attempt bornés et des timestamps readiness ;
les métadonnées de page sont sélectionnées avant la lecture des BLOBs, les
stats ne contiennent aucun payload et les receipts partiels exacts sont
transactionnels. Une database connue en schéma V1 migre atomiquement. Les
schémas inconnus et futurs restent bloqués par l'update wall ; le rollback
exige la sauvegarde vérifiée antérieure à la migration.
:::

## Limites certifiées

La certification release sur source propre au commit `0f6f6d0` a réussi sous
macOS arm64 avec Rust 1.97.1. Pour 2 048 ajouts durables de 1 Kio et 2 048
lectures ponctuelles, le p99 d'ajout était de 1,086 ms à 3 729 opérations/s et
le p99 de lecture de 0,583 ms à 6 578 opérations/s. La sauvegarde en ligne
vérifiée de 3 182 592 octets a pris 73,870 ms ; le contrôle d'intégrité complet
15,675 ms. Les 14 tests de conformité ont aussi réussi sous Linux arm64 et
amd64 ; le check croisé et Clippy Windows GNU ont réussi.

Le provider utilise les contrats coordonnés `appcore-sync` et `appcore-storage`
`2.0.0-alpha.1`. Les applications stables `1.0.0` ne le sélectionnent pas
implicitement ; l'adoption est un choix explicite de prerelease.
