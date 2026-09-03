---
title: appcore-ops
sidebar_position: 13
---

# appcore-ops

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-ops/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-ops/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-ops)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-ops/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** health, logs, métriques, observations, heartbeat et
availability sans vendor.

**Dépendances internes :** `appcore-core`, `appcore-supervisor`.

**API principale :** health status/report/checks, heartbeat sources, loggers,
metric counters, `ObservationEvent`/`ObservationSink`, file sink borné,
availability report et reexports de compatibilité pour
`appcore-supervisor::managed_services`.

Le sink d'observations local au processus retient au plus 65 536 événements et
16 Mio ; le registre de métriques retient au plus 4 096 noms, 128 octets par
nom et 1 Mio agrégé. Tous deux exposent pression de comptage/octets et snapshots
immuables partagés tout en conservant les API de snapshot owned. Une observation
trop grande n'est pas retenue mais atteint toujours les 32 drains configurés au
maximum. Le logger mémoire retient aussi au plus 4 096 enregistrements et 8 Mio
et expose `shared_records`.
La beta actuelle du Runtime stocke la configuration des drains dans une
génération immuable copy-on-write. Chaque observation partage un pointeur de
génération au lieu de cloner jusqu'à 32 handles de drain, et les callbacks
s'exécutent toujours après la libération du lock de configuration.
`SharedObservationEvent::new` applique l'expurgation et les limites de champs
une seule fois. Le hub mémoire transmet ce payload immuable via
`ObservationSink::emit_shared` ; les sinks internes mémoire, fichier et
métriques évitent les copies profondes, tandis que les implémentations
existantes owned utilisent automatiquement le comportement compatible par
défaut.

Dans la beta Runtime actuelle, `FileObservationSink::flush` utilise un seul
deadline de 30 secondes pour l'admission dans la file bornée et
l'acknowledgement durable du worker. `flush_timeout` accepte un délai positif
plus court. Une file pleine ou un worker bloqué renvoie `TimedOut` ; un flush
déjà en file peut finir sans risque après le deadline du caller.

À utiliser pour signaux génériques. Le nouveau code lifecycle utilise
`appcore-supervisor` directement. Ne pas ajouter de SDK vendor ni métriques
métier applicatives au crate.

**Maturité :** primitives stables; export/collection production appartient
au déploiement.
