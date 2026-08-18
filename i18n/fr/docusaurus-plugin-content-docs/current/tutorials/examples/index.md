---
title: Exemples — du niveau débutant à intermédiaire
sidebar_position: 0
slug: /tutorials/examples/
---

# Exemples — du niveau débutant à intermédiaire

Ce parcours fait évoluer une seule application externe sans franchir la
frontière AppCore. Chaque étape conserve les trois artefacts appartenant à
l'application : Application Manifest, Deployment Manifest et code métier.
L'infrastructure reste dans `appcore-bin`.

| Niveau | Exemple | Leçon principale |
| --- | --- | --- |
| 1 — Débutant | [Ping standalone](./standalone-ping) | Installer depuis crates.io, déclarer une command et démarrer en sécurité |
| 2 — Débutant+ | [Command, event et query](./command-event-query) | Appliquer le manifest, émettre un fait, ajouter une lecture sans side effects et tester les deux chemins |
| 3 — Intermédiaire | [Task planifiée](./scheduled-task) | Enregistrer un travail borné tandis que le Runtime possède workers et shutdown |
| 4 — Intermédiaire | [De standalone à cluster](./standalone-to-cluster) | Conserver le code métier et changer l'infrastructure par le deployment |

## Avant de commencer

- Installer Rust `1.89` ou plus récent.
- Utiliser AppCore `1.0.1-rc.8`.
- Garder les secrets hors des manifests.
- Exécuter chaque exemple depuis la racine du projet.

Les exemples utilisent la façade publique `appcore_bin::application`. Ils ne
copient pas `RuntimeBuilder`, ne construisent pas de listener HTTP manuel et
n'instancient pas les providers storage/security dans le code applicatif.

## Ce que ces exemples ne garantissent pas

File provider local, HTTP loopback et coordination file-backed sont des profils
d'apprentissage et de conformité. Un deployment de production reste
responsable de TLS, gestion des secrets, garanties filesystem, backup,
capacité et preuves des providers opérés.
