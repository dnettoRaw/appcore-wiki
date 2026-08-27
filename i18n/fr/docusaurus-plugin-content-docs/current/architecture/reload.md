---
title: Reload coordonné
sidebar_position: 8
---

# Reload coordonné

AppCore 1.0 démarre avec une configuration HTTP immuable et reste le paquet
stable. Le candidat `appcore-api 1.0.2-rc` introduit une transaction opt-in de génération de
routing pour les changements qui conservent l'adresse du listener.

## Transaction

1. Composer un Router candidat avec une génération `u64` strictement plus récente.
2. Exiger la même adresse active et des délais positifs et bornés.
3. Appeler `/v1/health` sur le candidat avant activation.
4. Fermer l'admission ancienne et sélectionner atomiquement le candidat.
5. Appeler encore `/v1/health` via le candidat sélectionné.
6. Drainer l'ancien in-flight avant de libérer ses ressources.

Une requête acceptée garde sa génération jusqu'à sa fin. La couche de reload ne
la déplace ni ne la répète. Un échec de santé après commutation ou de drain
restaure la génération précédente, ferme l'admission défaillante et effectue un
nettoyage borné. Les reloads concurrents ou obsolètes échouent explicitement.

## Ownership et limites

`appcore-api` possède les générations de routing. `appcore-bin` enregistre le
owner comme service géré `http` existant. Le Supervisor actuel reste l'unique
owner du lifecycle et le redémarrage du processus reste externe.

Les délais health et drain sont plafonnés à 60 secondes. Les snapshots exposent
seulement génération, in-flight, transaction, succès, échec et rollback. Ils ne
contiennent jamais payloads, tokens, IDs de requête ou tenant ni adresses.

Le leadership ne dérive pas de la génération de routing. Les commands valident
toujours le lease et le fencing actuels ; le reload ne crée donc pas deux epochs
valides.

## Rotation d'adresse et de certificat

Changer l'adresse exige que la composition root lie et valide une autre
génération de listener avant de modifier le routing externe. Ce changement ne
devient pas silencieusement un reload in-place. Les certificats inbound restent
une frontière sidecar du deployment sous AC-024 ; leur rotation ne réinterprète
pas les manifests Runtime.

Utilisez le [profil sidecar TLS entrant](./inbound-tls-sidecar) pour la rotation
des certificats. Il garde le listener Runtime stable et ne crée pas un second
chemin de routing Runtime.

Le candidat actuel `appcore-api 1.0.2-rc` implémente le routing sur le même listener et accepte un
listener TCP pré-lié. La composition avec changement d'adresse et la
certification externe multiplateforme restent en attente. Cette API n'est pas
disponible dans le paquet stable `1.0.0`.

## Preuves

Le test sur socket réel maintient une requête génération 1 active, commute le
même listener, sert la génération 2 puis termine la génération 1. Le run AC-022
local propre a mesuré 750 ns de surcoût p99, 26,7 us p99 par reload à 41 488
reloads/s et 42 ns p99 par snapshot. Les 256 reloads ont été commit sans échec,
rollback ni in-flight résiduel. Les CI Linux et Windows restent les preuves de
plateforme autoritatives.
