---
title: Modèle de sécurité
sidebar_position: 9
---

# Modèle de sécurité

Les échecs de sécurité commencent souvent quand une frontière devient floue : secret dans un manifest, retry accepté deux fois, Peer RPC rejoué avec un autre body, ou update accepté parce que le chemin semble familier.

La sécurité AppCore est un ensemble de frontières : manifests versionnés, tokens signés, secret references, replay protection, payloads bornés, fichiers privés, DNT et diagnostics expurgés.

## Pourquoi les tokens signés ne sont-ils pas des containers de secrets ?

Les tokens sont signés, pas chiffrés. Ne placez pas de secrets dans manifests, URLs, logs ou debug output.

Les credentials Gateway et Peer RPC ont la finalité `peer`. Les credentials de
connexion Gateway ont une durée courte, un usage unique et sont liés à
l'identité de connexion. Les tokens de request Peer RPC peuvent être liés au
hash d'une envelope.

Les hashes liés aux requests utilisent le format SHA-256 canonique `v2:`, avec
séparation de domaine, framing par longueur et présence explicite des champs
optionnels. Les anciens hashes sans version sont rejetés ; émetteurs et
validateurs doivent évoluer ensemble. L'authentification HTTP command/query
échoue fermée par défaut ; seul le constructeur explicite de test local la
désactive, et `/v1/health` reste public par contrat.

## Où le replay est-il bloqué ?

La replay protection apparaît à plusieurs niveaux :

- les idempotency keys empêchent la répétition des commands client ;
- séquences et checkpoints empêchent les enregistrements de réplication en double ;
- les nonces Peer RPC empêchent la réutilisation des envelopes ;
- les valeurs `jti` Gateway empêchent la réutilisation des credentials ;
- build IDs et versions empêchent de réactiver l'artefact actif sous un autre path.

## Que couvre la sécurité du filesystem ?

Les formats de fichier Runtime rejettent symlinks et path traversal lorsque le
provider possède la frontière. Plusieurs stores emploient sous Unix des
répertoires ou fichiers réservés au owner, des locks explicites, des lectures
bornées, des fichiers temporaires, un remplacement atomique et le sync du
répertoire parent.

Les fichiers secret structurés utilisés au démarrage Auth Server, par les auth
grants et l'inspection status sont limités à 64 Kio. Un metadata trop grand
échoue avant l'allocation, un octet sentinelle détecte la croissance concurrente
et le owner d'input est expurgé et remis à zéro après parsing.

Cela ne sécurise pas un host compromis. Si le compte du système d'exploitation
est compromis, les fichiers locaux peuvent être attaqués hors du processus.

## Pourquoi DNT lie-t-il le contexte ?

DNT authentifie le header et chiffre payload et metadata. Comme le header
contient application ID, tenant ID facultatif, content type, codec ID, key ID
et schema version, une envelope ne peut changer de contexte sans échec de
vérification.

## Pourquoi la sécurité des updates combine-t-elle policy et bytes ?

Elle combine policy du descriptor, authenticité cryptographique, limites de
bytes, intégrité SHA-256, staging immuable, health checks d'activation et
rollback. Les artefacts locaux unsigned exigent une feature dédiée et une
validation stricte des fichiers ; ils ne sont pas le default de production.

## Comment traiter les advisories présentes uniquement dans le lockfile ?

Une advisory n'est pas ignorée au seul motif qu'une feature est supposée être
désactivée. `rust_decimal` déclare en amont un support optionnel de `rkyv` 0.7 ;
Cargo inscrit donc ce package dans les métadonnées du lockfile alors que
FileMaker n'active que `std` et Serde sous forme de chaîne. Avant d'accepter
`RUSTSEC-2026-0235` comme lock-only, le gate de release vérifie toutes les
features, targets et edges du workspace et exige l'absence de `rkyv`. Son
activation fait échouer le gate avant l'exception.

## Statut du provider Windows DPAPI

AC-009 a accepté `windows-dpapi-user-v1` pour la ligne de développement
post-1.0. L'implémentation `1.0.2-rc` protège chaque enregistrement de rotation
borné avec DPAPI non interactif avec portée utilisateur : le même utilisateur
sur le même ordinateur est normalement requis pour déchiffrer. La portée
machine est exclue car elle permettrait le déchiffrement par d'autres
utilisateurs locaux. La sélection est opt-in et ne revient jamais implicitement
à `env-file`, `file-keyring-v1` ou à la portée machine. Les opérations CLI
doivent passer `--keyring-provider windows-dpapi-user-v1` ; son omission
sélectionne le comportement inchangé de `file-keyring-v1`.

La racine persistée doit aussi appartenir au SID de l'utilisateur courant,
avoir une DACL protégée limitée au propriétaire et refuser links, junctions et
autres reparse points. Backup et restauration sont limités au même profil et à
la même machine. Rotation, révocation, restauration avec le même utilisateur,
séparation de format et redaction ont des tests de dépôt, et tous les
exécutables de test du Runtime sont cross-buildés pour Windows. Le provider
n'est pas certifié avant réussite de la matrice Windows réelle
multi-utilisateur et multi-machine ; cross-compilation et tests mockés ne
constituent pas cette preuve. La ligne stable 1.0 ne change pas et la mise à
niveau est explicite.

## Limitations

- AppCore ne fournit pas OAuth.
- Il ne fournit pas terminaison TLS universelle pour chaque deployment.
- Il n'opère pas de vault managé de production.
- Les clés hardware-backed ne font pas partie du contrat stable 1.0.
- L'autorisation métier appartient à l'application.
- Un hôte compromis peut attaquer les fichiers locaux hors du processus AppCore.

Suivant : [providers](/fr/architecture/providers).
