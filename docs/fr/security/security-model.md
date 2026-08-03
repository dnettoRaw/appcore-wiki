---
title: Modèle de sécurité
sidebar_position: 9
---

# Modèle de sécurité

La sécurité AppCore est un ensemble de frontières : manifests versionnés, tokens signés, secret references, replay protection, payloads bornés, fichiers privés, DNT et diagnostics expurgés.

Les tokens sont signés, pas chiffrés. Ne placez pas de secrets dans manifests, URLs, logs ou debug output.

Le replay est traité par couches : idempotency key pour commands, séquence/checkpoint pour sync, nonces pour Peer RPC, `jti` single-use pour gateway et checks build/version pour updates.

DNT authentifie le contexte et chiffre le payload. Peer RPC valide tenant, cluster, core, protocole, expiry, nonce, hash et token bound. Gateway valide connexion et mesh request. Update valide policy, signature, checksum et health gate.

Non-objectifs : OAuth, terminaison TLS universelle, vault managé, hardware-backed keys dans la ligne 1.0 RC, autorisation métier et défense contre hôte compromis.

Suivant : [providers](/fr/architecture/providers).

