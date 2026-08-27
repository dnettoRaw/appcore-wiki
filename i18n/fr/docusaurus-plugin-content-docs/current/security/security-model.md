---
title: Modèle de sécurité
sidebar_position: 9
---

# Modèle de sécurité

Les échecs de sécurité commencent souvent quand une frontière devient floue : secret dans un manifest, retry accepté deux fois, Peer RPC rejoué avec un autre body, ou update accepté parce que le chemin semble familier.

La sécurité AppCore est un ensemble de frontières : manifests versionnés, tokens signés, secret references, replay protection, payloads bornés, fichiers privés, DNT et diagnostics expurgés.

Les tokens sont signés, pas chiffrés. Ne placez pas de secrets dans manifests, URLs, logs ou debug output.

Les hashes liés aux requests utilisent le format SHA-256 canonique `v2:`, avec
séparation de domaine, framing par longueur et présence explicite des champs
optionnels. Les anciens hashes sans version sont rejetés ; émetteurs et
validateurs doivent évoluer ensemble. L'authentification HTTP command/query
échoue fermée par défaut ; seul le constructeur explicite de test local la
désactive, et `/v1/health` reste public par contrat.

Le replay est traité par couches : idempotency key pour commands, séquence/checkpoint pour sync, nonces pour Peer RPC, `jti` single-use pour gateway et checks build/version pour updates.

DNT authentifie le contexte et chiffre le payload. Peer RPC valide tenant, cluster, core, protocole, expiry, nonce, hash et token bound. Gateway valide connexion et mesh request. Update valide policy, signature, checksum et health gate.

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

Suivant : [providers](/architecture/providers).
