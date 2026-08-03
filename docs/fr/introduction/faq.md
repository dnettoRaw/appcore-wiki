---
title: FAQ
sidebar_position: 5
---

# FAQ

## Introduction

Cette page répond directement aux questions d'adéquation et de périmètre pour que les lecteurs ne donnent pas à AppCore un rôle qu'il n'a pas.

## Questions

### Is AppCore a web framework?

Non. Il expose des endpoints HTTP de command/query/status, mais le runtime prend aussi en charge manifests, cycle de vie, contrats de stockage, sécurité, scheduling, sync, Peer RPC, coordination du control plane, supervision et updates.

### What is the recommended application entry point?

Les nouvelles applications implémentent `appcore_bin::application::Application` et appellent `run_application`.

### What are the three artifacts?

`application.toml`, `deployment.toml` et le code métier. Le premier est portable et écrit par l'application. Le second appartient à l'installation et sélectionne les providers. Le code métier reçoit un contexte de runtime validé au lieu d'assembler l'infrastructure manuellement.

### What should not be placed in manifests?

Secrets, clés privées, valeurs locales réservées à l'opérateur, payloads métier et schémas de domaine.

### Does AppCore provide consensus?

Non. Sync est une réplication conservative leader-to-follower ; le fonctionnement distribué utilise leases, fencing, découverte via control plane et Peer RPC. Le consensus multi-master est hors périmètre.

## Pages liées

- [Statut du projet](/fr/introduction/project-status)
- [Manifest Concept](/fr/concepts/manifests)
- [Provider Model](/fr/concepts/providers)
