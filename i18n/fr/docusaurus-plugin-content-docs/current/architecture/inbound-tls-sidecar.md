---
title: Sidecar TLS entrant
sidebar_position: 13
---

# Sidecar TLS entrant

Le TLS entrant appartient à la frontière de déploiement. AppCore écoute
uniquement en HTTP loopback ; Caddy ou Envoy possède le socket TLS public, les
certificats, les contrôles de santé et le transfert. Le Runtime ne lit jamais
la clé privée et ne fournit aucun fallback en clair.

```mermaid
flowchart LR
    Client[Client] -->|HTTPS| Sidecar[Caddy ou Envoy]
    Sidecar -->|HTTP sur loopback| Runtime[AppCore Runtime]
```

La source 2.0 fournit Caddy 2.11.4 pour systemd, launchd et Windows/WinSW,
ainsi qu'Envoy 1.39.0 pour systemd. Il s'agit de développement, pas de la
surface stable 1.0.

## Forme de déploiement obligatoire

- Lier le Runtime à `127.0.0.1:<port>` et interdire l'accès distant par pare-feu.
- Exposer le sidecar uniquement en TLS et garder son admin en loopback.
- Protéger les chemins certificat/clé ; ne jamais placer les octets de clé dans manifests, arguments ou logs.
- Démarrer Runtime puis sidecar. Publier seulement après le succès HTTPS de `/v1/health` avec nom et chaîne validés.
- La readiness est le health HTTPS externe ; liveness et health loopback sont diagnostiques.

Les templates sont sous `packaging/tls-sidecar` dans la source beta privée.
`appcore-dev service check` interdit de retirer l'upstream loopback, les entrées
TLS, les health checks bornés, les limites ou le durcissement du service.

## Rotation et rollback

Vérifier la paire complète sous un nouveau chemin owner-only et la publier
atomiquement. Caddy valide et recharge le candidat ; Envoy observe les moves
atomiques du répertoire. Garder la paire précédente jusqu'au health HTTPS.

Un échec conserve ou restaure la paire précédente. Si le sidecar s'arrête,
l'endpoint public devient indisponible et le port Runtime reste inaccessible.
Si le Runtime s'arrête, le sidecar marque l'upstream unhealthy sans alternative
ou destination en clair.

La rotation ne change pas la routing generation AppCore : les requêtes acceptées
restent au sidecar et le listener Runtime demeure stable. Le changement
d'adresse appartient au routing externe du déploiement.

## Preuves et limites

Les profils ont été acceptés par les images officielles Caddy 2.11.4 et Envoy
1.39.0 sous Docker Linux/arm64. AC-024 reste ouverte jusqu'aux essais Unix et
Windows réels : refus cleartext, rotation pendant les requêtes,
expiration/révocation, perte de processus, rollback et charge bornée. Windows
dépend aussi d'AC-009.

Continuez avec le [reload HTTP coordonné](./reload).
