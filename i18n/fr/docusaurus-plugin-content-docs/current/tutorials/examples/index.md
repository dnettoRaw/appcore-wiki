---
title: Exemples — Du Niveau Basique à Intermédiaire
sidebar_position: 0
slug: /tutorials/examples/
---

# Exemples — Du Niveau Basique à Intermédiaire

Ces exemples font évoluer une application externe avec la façade actuelle
`appcore-sdk`. Chaque étape conserve les trois artefacts possédés : Application
Manifest, Deployment Manifest et code métier.

| Niveau | Exemple | Leçon principale |
| --- | --- | --- |
| 1 | [Application locale minimale](./standalone-ping) | Valider les manifestes locaux canoniques et le logging |
| 2 | [Enregistrement applicatif](./command-event-query) | Enregistrer les contrats sans construire l'infrastructure |
| 3 | [Contrat de tâche planifiée](./scheduled-task) | Déclarer un travail borné pour le scheduler du déploiement |
| 4 | [Standalone vers cluster](./standalone-to-cluster) | Conserver le métier quand la politique de déploiement change |

Commencez avec `appcore-sdk = "1.0.0-rc.1"` et activez uniquement les features
utilisées. Aucun exemple ne crée de host implicite ni de CLI Runtime.
