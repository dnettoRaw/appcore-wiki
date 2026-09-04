---
title: appcore-bin (retiré)
sidebar_position: 22
---

# appcore-bin est retiré

:::danger Ne pas utiliser pour une nouvelle application
`appcore-bin` a été supprimé du workspace Runtime. Son dernier package
crates.io, [`1.0.1`](https://crates.io/crates/appcore-bin/1.0.1), est un avis de
retrait sans dépendance et ne fournit ni exécutable, ni host, ni CLI, ni couche
de compatibilité, ni comportement Runtime. Toutes les versions fonctionnelles
précédentes sont yanked.
:::

Utilisez [`appcore-sdk 1.0.0-rc.1`](https://crates.io/crates/appcore-sdk/1.0.0-rc.1)
pour les contrats applicatifs, les manifestes canoniques, l'enregistrement, le
logging et les namespaces de capabilities optionnels.

Les applications existantes conservent `application.toml`, `deployment.toml`
et leur code métier. Remplacez les imports `appcore_bin` par `appcore_sdk` ;
l'exécutable de déploiement reste responsable des providers, listeners,
workers, signaux et du shutdown.

Les anciennes releases de `appcore-bin` ne restent que comme preuve dans le
registre. Elles ne constituent plus l'API applicative actuelle d'AppCore.
