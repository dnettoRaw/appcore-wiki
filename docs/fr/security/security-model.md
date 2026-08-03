---
title: Modèle de sécurité
sidebar_position: 9
---

# Modèle de sécurité

Les échecs de sécurité commencent souvent quand une frontière devient floue : secret dans un manifest, retry accepté deux fois, Peer RPC rejoué avec un autre body, ou update accepté parce que le chemin semble familier.

La sécurité AppCore est un ensemble de frontières : manifests versionnés, tokens signés, secret references, replay protection, payloads bornés, fichiers privés, DNT et diagnostics expurgés.

Les tokens sont signés, pas chiffrés. Ne placez pas de secrets dans manifests, URLs, logs ou debug output.

Le replay est traité par couches : idempotency key pour commands, séquence/checkpoint pour sync, nonces pour Peer RPC, `jti` single-use pour gateway et checks build/version pour updates.

DNT authentifie le contexte et chiffre le payload. Peer RPC valide tenant, cluster, core, protocole, expiry, nonce, hash et token bound. Gateway valide connexion et mesh request. Update valide policy, signature, checksum et health gate.

## Limitations

- AppCore ne fournit pas OAuth.
- Il ne fournit pas terminaison TLS universelle pour chaque deployment.
- Il n'opère pas de vault managé de production.
- Hardware-backed keys ne sont pas une garantie de la ligne 1.0 RC.
- L'autorisation métier appartient à l'application.
- Un hôte compromis peut attaquer les fichiers locaux hors du processus AppCore.

Suivant : [providers](/fr/architecture/providers).
