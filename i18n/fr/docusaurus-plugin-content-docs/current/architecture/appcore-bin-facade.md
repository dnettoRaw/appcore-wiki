---
title: Ownership de la façade appcore-bin
sidebar_position: 13
---

# Ownership de la façade appcore-bin

AC-023 a évalué le déplacement de la façade manifest-first vers un crate SDK
léger, tandis que `appcore-bin` resterait le host Runtime.

## Décision

`appcore-bin` reste la façade manifest-first publique et l'unique composition
root du contrat 1.x actuel. Aucun crate `appcore-sdk` ou `appcore-runtime` n'est
créé.

Les applications continuent d'implémenter
`appcore_bin::application::Application` et d'appeler
`appcore_bin::application::run_application`. Un seul owner conserve ainsi les
manifests, providers, listeners, lifecycle, Supervisor et shutdown, tout en
préservant le [contrat des trois artefacts](./three-artifact-contract).

## Preuve

Un build optimisé propre du consumer maintenu à trois artefacts au commit
`a33a934`, avec Rust 1.97.1 sur macOS arm64, comptait 22 packages AppCore et 196
packages dans le graphe normal. Il a duré 170,46 secondes, atteint 693 846 016
octets de RSS maximal, produit un binaire de 10 242 592 octets et occupé
481 808 KiB dans le nouveau target Cargo.

Le coût de compilation est réel, mais séparer seulement les traits de façade ne
retire pas le graphe du host de l'exécutable : `run_application` doit toujours
atteindre la composition root concrète. La séparation ajouterait donc un crate
ou modifierait le chemin public stable sans bénéfice démontré sur l'artefact.

## Réévaluation

La décision ne peut être réévaluée que dans un jalon 1.x ultérieur avec des
consumers réels de type bibliothèque uniquement, un owner de composition unique
dans un graphe acyclique, des preuves consumer packagé et SemVer, et une
réduction mesurée d'au moins 20 % du build propre ou du graphe. Alias de
compatibilité, migration implicite et seconde composition root restent
interdits.
