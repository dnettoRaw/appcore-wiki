---
title: appcore-bin
sidebar_position: 22
---

# appcore-bin

:::info Paquet publié
Stable **`1.0.0`** · MSRV **Rust `1.89`** · [crates.io](https://crates.io/crates/appcore-bin/1.0.0) · [docs.rs](https://docs.rs/crate/appcore-bin/1.0.0) · [code source](https://github.com/dnettoRaw/AppCore-Runtime/tree/v1.0.0/crates/appcore-bin)
:::

## Guide et exemples maintenus par le crate

Le dépôt Runtime maintient le [guide détaillé](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/guide.fr.md), [exemple débutant](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/examples/basic.fr.md) et [exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/v1.0.0/crates/appcore-bin/wiki/examples/intermediate.fr.md). Le wiki résume la frontière publique ; les détails d’API et d’exécution restent avec le code du crate.

**Responsabilité :** façade manifest-first, CLI et composition root.

**Dépendances internes :** tous les crates service/composition.

**API application :** `Application`, `run_application`,
`ManifestApplicationHost`, `ApplicationServiceReport`, `DeploymentContext`,
volumes/environment résolus et `ApplicationTaskRegistry`.

**API host :** bootstrap/config errors/results, CLI, paths/lifecycle local,
server entry points, build info et outils auth-server optionnels.

Les deux binaires traitent une entrée UTF-8 bornée avec `appcore-args`. L'aide,
la validation et la complétion dynamique Bash, Zsh, Fish et PowerShell
partagent une spécification déclarative; l'exécution reste dans ce crate.

Le manifeste distribué final alimente un catalogue unique
`appcore-capabilities` pendant le bootstrap. La façade directe, le HTTP
applicatif et le peer RPC utilisent le même owner pour l'enforcement de
déclaration, mode, idempotence, écriture opérationnelle et leadership. Les
queries de statut Runtime restent un comportement explicite du host.

Sur la ligne de maintenance 1.0 actuelle, les handlers de la façade directe,
du HTTP applicatif et du peer RPC s'exécutent sans conserver le mutex partagé
du host. Les commandes indépendantes progressent en parallèle ; la réservation
idempotente reste sérialisée par store. `shutdown()` ferme l'admission, draine
les commandes admises pendant au plus 30 secondes, puis termine le lifecycle.
Les tests embarqués peuvent choisir une borne plus courte avec
`shutdown_with_timeout`.
L'enregistrement des queries applicatives est gelé après le bootstrap ; les
queries directes, HTTP et peer RPC clonent le router immuable et s'exécutent
sans le mutex du host.

Selectionner `[adapters.gateway]` avec le provider `appcore-gateway` est la
frontiere declarative d'activation du Gateway. Le bootstrap parse la
configuration dans la crate owner, ajoute et autorise `runtime.gateway` dans le
catalogue partage, reutilise la securite du Runtime et enregistre le service
dans le Supervisor. Une erreur de configuration ou de bind arrete le startup;
l'absence ne cree aucun listener ni task Gateway. `ApplicationServiceReport`
expose les champs surs started, state et bind, et le shutdown du host joint
tout le travail possede par le Gateway. Le replay store est sur entre
processus; cluster exige `paths.gateway_replay` absolu sur un volume partage et
inscriptible. Le shutdown ferme les connexions incompletes avant son delai.

C'est la dépendance recommandée des applications. Il possède chargement des
manifests, providers, lifecycle, HTTP, sync, peer RPC, control plane,
Gateway, scheduling, supervision, updates et shutdown.

Les applications utilisent le module public `application` et évitent internals.

## Intégration AI expérimentale disponible dans les sources

Le workspace de développement actuel contient la feature opt-in `ai-alpha`,
qui **ne fait pas partie de l'artefact `appcore-bin 1.0.0` publié**. Elle
rattache un `appcore_ai::AiRuntime` configuré via `AppCoreAiComponent` et
`ManifestApplicationHost::with_ai`. Le Supervisor existant possède health
required/optional, annulation et shutdown borné.

Ce bridge programmatique ne modifie pas les manifests V1. Il appartient à la
release beta indépendante [`appcore-ai 0.1.0-beta.1`](./appcore-ai) ; la sélection
déclarative exige un contrat versionné post-1.0 et une release AppCore
publiable.

**Maturité :** façade manifest-first stable; internals restent détails.
