---
title: appcore-storage
sidebar_position: 11
---

# appcore-storage

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-storage/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-storage/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-storage)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-storage/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-storage/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-storage/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** contrats de stockage génériques et provider fichier local
borné.

**Dépendances internes :** `appcore-contracts`, `appcore-dnt`,
`appcore-security`, `appcore-types`.

**API principale :** `StorageProvider`, `Repository`, `Migration`,
`Transaction`, health/status/errors, IDs validés, `FileStorageProvider`,
manifests storage, backup V1, helpers authentifiés de stockage distant et
stores optionnels scellés par DNT pour objets, snapshots et secrets.

L'adapter fichier scellé écrit du DNT normal par défaut et expose
`DntFileObjectStore::write_object_compact` pour snapshots, backups et fichiers
domaine exportables quand le payload est compressible. Les écritures compactes
restent des enveloppes DNT ordinaires sur le même provider fichier ; le contrat
du backend de stockage ne change pas.
Les lectures scellées dérivent une limite d'enveloppe complète depuis
`SealedStoragePolicy` et rejettent les fichiers trop grands avant l'allocation
du buffer fichier.

Les snapshots complets conservent leur inventaire borné de fichiers, mais leur
manifest V1 de 16 Mio n'exige plus un buffer encodé complet à ses côtés. Le
pretty JSON est sérialisé directement par un writer borné de 16 Kio vers un
temporaire atomique exclusif, puis désérialisé par un reader borné de 16 Kio.
Une entrée exactement à la limite reste valide et un octet non retenu détecte
la croissance concurrente.

À utiliser pour le profil local-first documenté. Garder schémas et tables
domaine hors du Runtime. Les transactions non supportées échouent.

Le housekeeping et la traversée des backups sont itératifs, bornés et ne
suivent jamais les symlinks ni les reparse points Windows. Le listing utilise
les timestamps persistés dans le manifest snapshot et ne recourt aux
métadonnées de création/modification que pour les backups fichier simples.
L'ouverture finale emploie le mode no-follow de la plateforme et est revalidée
sous le lock du processus. Le profil mono-processus suppose toujours un root
protégé par son propriétaire: le remplacement hostile d'un répertoire ancêtre
par un autre processus du même compte pendant l'opération reste hors de cette
boundary portable.

La traversée visite au maximum 200 000 entrées de manière incrémentale, en ne
retenant que la pile bornée de 16 384 répertoires et les résultats requis par le
consommateur. Le snapshot conserve ses paths triés nécessaires sans seconde
liste globale ; health ne garde qu'un compteur, cleanup seulement les
temporaires correspondants et la validation des symlinks aucune entrée. La
profondeur reste plafonnée à 128.
La vérification du snapshot compte également les fichiers réels de manière
incrémentale et emprunte le path précédent pendant le contrôle de l'ordre ; elle
ne construit pas un second inventaire de paths et ne clone pas un path par
entrée.

## Preflight de capacités post-1.0

`StorageCapabilityDescriptorV1` définit sept garanties exactes: transactions,
locking, snapshot, streaming, backup en ligne, multi-processus et multi-hôte.
Le catalogue est limité à 32 providers. Les deployments activent explicitement
`required_capabilities`; `storage.shared=true` exige `multi_host`. Toute
exigence inconnue, dupliquée ou non supportée échoue avant l'ouverture sans
provider plus faible. Le provider fichier annonce seulement `snapshot`. Le
format publié des manifests V1 ne change pas.

La certification clean-source à `12cbfc3` a mesuré un p99 de 83 ns et
10 493 879 preflights/s sous les bornes fixes de sept capacités et 32 providers.

**Maturité :** contrats stables; provider fichier certifié pour un processus
local et filesystem aux sémantiques lock/sync/rename requises.

## Bootstrap du candidat et fichiers atomiques individuels

Ajouts disponibles dans `1.0.5-rc` : après blocage et drainage des writes, le deployment
peut appeler `authorize_candidate_bootstrap("candidate")` une fois. Réserver avant
`seal_after_install_start`, puis consommer l'autorité avec `run`. Le callback
reçoit un `CandidateBootstrapPermit` borné, sans API clone/nesting/escape.
`open` normal reste refusé ; succès, erreur ou panic laissent la barrière scellée.
Abandonner l'autorité inutilisée la révoque. Le deployment choisit candidat et
permissions filesystem ; l'admission est locale au processus, ni token entre
processus, ni sandbox, ni mécanisme d'autorisation du filesystem.

`AtomicFileWriter::new(absolute_path, max_bytes)?.write(bytes)` remplace un fichier
hors racine gérée. Parents réels existants requis ; symlinks/reparse et traversal
refusés. Budget de 1 octet à 64 Mio ; contrôle avant staging et sync du temporaire
exclusif avant rename. Unix utilise 0600 et sync du parent ; les autres plateformes
conservent les limites de durabilité du provider. Le deployment protège les
parents. En concurrence, le dernier rename réussi gagne ; aucune transaction.
Une erreur de sync après rename peut laisser les nouveaux octets visibles.

Un format de backup applicatif exige un pont d'import externe : borner et
authentifier/déchiffrer avec le codec original, refuser versions inconnues et
chemins dangereux, valider l'inventaire et préparer les fichiers opaques vérifiés
dans un nouveau snapshot. Valider avant permutation des racines, conserver
l'ancienne pour rollback et tester les interruptions. Ne pas renommer une archive
historique en snapshot Runtime ni ajouter de parseurs historiques dans AppCore.

## Release publiée

`1.0.5-rc` — publié sur crates.io ; les versions précédentes restent immuables.

## Paquet publié

[`appcore-storage 1.0.5-rc`](https://crates.io/crates/appcore-storage/1.0.5-rc) · [docs.rs](https://docs.rs/appcore-storage/1.0.5-rc) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-storage).

## Prérelease indépendante — 2026-10-14

`1.0.5-rc.1`: alignement des dépendances.

[crates.io](https://crates.io/crates/appcore-storage/1.0.5-rc.1) · [docs.rs](https://docs.rs/appcore-storage/1.0.5-rc.1)
