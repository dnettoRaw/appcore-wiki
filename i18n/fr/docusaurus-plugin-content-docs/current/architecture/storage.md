---
title: Storage, DNT, backup et restore
sidebar_position: 4
---

# Storage, DNT, backup et restore

Imaginez une boutique qui écrit un devis quand le portable s'éteint. Au prochain boot, l'opérateur ne devrait pas deviner si le fichier contient moitié ancien état et moitié nouveau.

C'est le problème de storage qu'AppCore traite. Le storage AppCore n'est pas un ORM. C'est la frontière runtime pour fichiers durables, backup, restore, objets DNT, lectures authentifiées et health du provider.

## Pourquoi ne pas écrire directement le fichier final ?

Parce qu'une interruption pendant l'écriture peut rendre l'état ambigu. Un log de sync, un nonce store, un backup manifest ou un objet DNT doit être complet ou rejeté.

Le file provider suit un petit protocole :

1. résoudre le chemin sous la racine configurée ;
2. rejeter chemin absolu, `..`, prefix et symlink ;
3. prendre un lock quand la cohérence l'exige ;
4. écrire dans un fichier temporaire ;
5. appeler `sync_all` ;
6. remplacer avec rename atomique ;
7. synchroniser le répertoire parent quand le système le permet.

```mermaid
sequenceDiagram
    participant Runtime
    participant Provider as FileStorageProvider
    participant Lock
    participant Tmp
    participant Root
    Runtime->>Provider: write_bytes_atomic(path, bytes)
    Provider->>Provider: résoudre sous la racine
    Provider->>Lock: lock exclusif
    Provider->>Tmp: créer un fichier temporaire unique
    Tmp->>Tmp: écrire les bytes et fsync
    Tmp->>Root: rename atomique
    Root->>Root: sync parent
    Provider-->>Runtime: succès ou erreur explicite
```

## Pourquoi borner les lectures ?

Certains formats doivent être lus entièrement pour être vérifiés : DNT, checkpoint, backup manifest, update artifact, nonce store et état du control plane. AppCore rejette les fichiers trop grands avant allocation non bornée.

Le housekeeping et la traversée des backups sont itératifs et bornés ; ils ne
suivent jamais les symlinks ni les reparse points Windows. L'ouverture finale
utilise le mode no-follow de la plateforme et est revalidée avec le lock du
processus. Les listings préfèrent le timestamp persisté dans le manifest du
snapshot.

## Que se passe-t-il pendant un snapshot backup ?

Backup snapshot utilise `appcore-storage-backup-v1`, inventaire trié, taille et SHA-256 par fichier. Restore copie le backup vérifié vers `restore.pending`, déplace le storage actuel vers `restore.previous`, active pending comme racine et nettoie previous. La récupération choisit pending/previous/current sans perdre la dernière racine valide.

Le répertoire final n'apparaît qu'après accord entre manifest et fichiers copiés. Restore ne fait pas confiance à une simple liste de fichiers ; il vérifie inventaire, tailles et hashes.

## Comment restore récupère-t-il après un crash ?

Restore effectue un échange de répertoires récupérable et rend chaque état
visible :

```mermaid
flowchart TD
    Verify[Charger et vérifier le manifest] --> Copy[Copier vers restore.pending]
    Copy --> Previous[Déplacer le storage vers restore.previous]
    Previous --> Activate[Activer restore.pending comme storage root]
    Activate --> Cleanup[Supprimer restore.previous]
    Activate -->|échec| Rollback[Restaurer restore.previous comme storage root]
```

## Pourquoi DNT authentifie le contexte ?

DNT est une enveloppe binaire authentifiée et chiffrée. Le header contient application ID, tenant optionnel, content type, codec, key ID, schema version, nonce, payload hash et metadata. Le header est AEAD additional data : modifier le contexte casse l'authentification.

```mermaid
flowchart LR
    Payload --> Codec
    Codec --> Compress[DEFLATE optionnel]
    Compress --> Hash[Digest avec clé]
    Hash --> Header
    Header --> AEAD
    Compress --> Plaintext[Payload + metadata chiffrée]
    Plaintext --> Encrypt[XChaCha20-Poly1305]
    Encrypt --> Envelope[DNT]
```

`read_verified` exige une limite de payload et rejette les grands fichiers
avant de tout charger. `open_owned` authentifie et ouvre un buffer possédé ; le
plaintext retourné peut être remis à zéro.

## Quels compromis ce modèle de storage impose-t-il ?

Le file provider est simple et inspectable, mais ce n'est pas une base
distribuée multi-writer. Le profil local attend un processus et un filesystem
qui respecte locks, sync et rename atomique. La coordination cluster emploie
des providers explicites. Ce choix préserve les petites installations
local-first sans prétendre qu'un répertoire partagé est une database générale.

## Limites

- Le file provider n'est pas une base distribuée multi-writer.
- AppCore ne compense pas un filesystem qui ment sur locks, flush ou rename atomique.
- Le profil mono-processus suppose un root protégé par son propriétaire ; un
  processus hostile du même compte remplaçant un répertoire ancêtre pendant
  l'opération reste hors de cette frontière portable.
- Backup couvre la racine de storage du runtime, pas les bases externes ni les effets métier.
- DNT protège bytes et contexte authentifié ; il ne définit pas l'autorisation métier.
- Restore n'annule pas les actions externes exécutées par les handlers applicatifs.

Suivant : [sync](/architecture/synchronization).
