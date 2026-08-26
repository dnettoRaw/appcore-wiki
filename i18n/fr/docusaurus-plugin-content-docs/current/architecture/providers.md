---
title: Providers
sidebar_position: 10
---

# Providers

La même application peut tourner sur un laptop, un notebook de boutique ou un cluster. Si le choix d'infrastructure vit dans le code métier, chaque installation devient un build différent.

Providers sont la frontière d'installation. Le deployment choisit l'infrastructure sans changer l'artefact applicatif.

`DeploymentProviderPlan` extrait storage, control plane, coordination store, secret provider, jobs, discovery, update, database, peer transport, command transport et adapters.

```mermaid
flowchart LR
    Manifest[Deployment Manifest] --> Plan[Provider plan]
    Plan --> Registry[ProviderRegistry]
    Registry --> Factory[ProviderFactory]
    Factory --> Provider[Provider instance]
    Secrets[Secret refs] --> SecretProvider
    SecretProvider --> Factory
```

Une factory est enregistrée par role et provider ID. Si la paire sélectionnée n'existe pas, creation échoue. Il n'y a pas de fallback implicite.

La sélection storage exécute aussi un preflight explicite de capacités
post-1.0. Un descriptor borné déclare des garanties exactes plutôt que des noms
d'implémentation; le provider sélectionné doit satisfaire chaque exigence avant
l'ouverture. Voir [preflight des capacités storage](/architecture/storage-provider-capabilities).

Le coordination store est runtime-owned, pas une base métier. Le secret provider résout les références après validation afin que les valeurs ne vivent pas dans les manifests.

Le lease de ressource partagée sur filesystem persiste un sidecar versionné du
plus grand epoch avant de publier le lease actif. Release, restart et
acquisition interrompue ne réutilisent donc pas d'epoch. Celui-ci ne sert de
fencing token que si chaque writer protégé le compare avant l'écriture ; un
filesystem sans lock, rename, sync de répertoire et cohérence de cache fiables
n'empêche pas seul le split-brain.

## Limitations

- Providers ne rendent pas standalone et cluster équivalents ; chaque mode a ses exigences.
- Provider sélectionné et absent échoue la creation au lieu de fallback.
- Secret provider résout des références, mais AppCore ne fournit pas de vault managé.
- Coordination store est infrastructure runtime, pas database applicative.
- Health provider indique disponibilité d'infrastructure, pas correction métier.

Suivant : [première application](/tutorials/first-application).
