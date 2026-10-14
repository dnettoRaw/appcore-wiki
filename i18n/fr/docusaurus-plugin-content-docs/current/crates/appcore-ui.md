---
title: appcore-ui — Bêta
sidebar_position: 24
---

# appcore-ui

:::info Bêta publique
`appcore-ui 0.1.0-beta.1` est disponible sur crates.io. Le rendu actuel prend en charge macOS.
:::

## Bêta publique indépendante

`appcore-ui 0.1.0-beta.1` rend des pages natives définies en Rust et des pages
web locales produites en HTML/TypeScript. Elle est disponible en bêta publique. Le backend actuel est macOS ; les autres plateformes restent futures.
Le roadmap UI plus large ne représente pas des APIs déjà implémentées.

Le module possède fenêtres, rendu, actions et bridge Runtime. Les applications
possèdent layouts, schemas et métier. Deployment sélectionne backend et
autorisation principal/capabilities et possède démarrage, pump et arrêt. Le SDK
prépare les registres ; il ne lance pas de host UI ni executor cachés.

## Pages natives et web

`UiNativePageV1` déclare texte/boutons validés avec frames fixes. Le backend
optionnel `native-macos` appelle directement les contrôles système. Fenêtres et
files d’actions sont bornées ; les activations ne contournent pas l’autorisation.

`UiWebBundle` contient HTML, JavaScript, CSS, images et fonts immuables produits
par l’application, avec paths/MIME explicites. Limites : 512 ressources, 2 MiB
chacune, 16 MiB de source retenue. Elles ne bornent pas toute la mémoire du moteur.
Le backend optionnel `web-macos` utilise le composant web du système sans embarquer
un moteur. Origine locale aléatoire par fenêtre, CSP/nosniff, stockage non persistant,
sans navigation externe, frames, popups ou réseau. Bindings système optionnels et
isolés ; le crate par défaut ne les inclut pas.

## Bridge Runtime et récupération

`attach_surface` est explicite avant chargement. Caller/origin natifs vérifiés ;
JSON ne choisit pas principal ou tenant. Autorisation obligatoire et catalogue
déclaré protègent commands, queries et souscriptions. Commands préservent
idempotence et événements des propriétaires Runtime existants. UI V1 reste
indépendant des versions manifests/peer ; une version non supportée retourne
`NO MORE SUPPORTED PLEASE UPDATE`.

Le client TypeScript typé n’ajoute pas de bibliothèque runtime. Requêtes, messages,
souscriptions et files ont limites, deadlines et annulation coopérative.
Backpressure et pertes sont visibles. Offline invalide les souscriptions ;
reconnexion crée une nouvelle fenêtre/surface et consulte l’état actuel. Close
rejette les Promises pendantes et libère la surface. Annulation ne revient pas
sur les effets. Le pump exige backend/autorisation non bloquants ou frontière
bloquante explicite bornée ; aucun worker/executor n’est caché dans le renderer.

## Preuves et portée

Fenêtres natives et web réelles inspectées. Action native, mise à jour DOM,
refus de navigation externe/script inline et fermeture propre vérifiés.
La fixture SDK exécute query, command, souscription et replay : un effet, un
événement Runtime et une notification ; autorité forgée et surface étrangère refusées.

Un consommateur externe indépendant réutilise un écran et son CSS avec données
synthétiques. Actualisation exécute une deuxième query ; fermeture native sort 0 :
`status_queries=2 pending_requests=0 retained_windows=0`. Ceci qualifie l’intégration
isolée, sans login/données de production ni migration complète. Tests Rust/TypeScript
couvrent validation, autorisation, saturation, annulation, deadlines, reconnexion,
pertes de files et arrêt.

Limites initiales : rendu macOS, layout natif fixe et notifications éphémères.
Page builder, génération IA, 3D natif et MCU restent futurs. Cette bêta ne qualifie pas un déploiement applicatif en production. Les nouveaux schemas UI n’ont pas d’ancienne version persistée
à convertir ; évolution incompatible exige version explicite et revue de
migration/rollback, en conservant les manifests actuels.

## Exemples interactifs et fonctions natives

Le profil natif inclut texte éditable, checkbox, dropdown, slider et progression déterminée, en plus du texte/boutons. `elements::{text,button,input,toggle,select,slider,progress}` sont des constructeurs Rust purs ; validez la page entière. `UiNativeWindow::{set_label,set_value,set_enabled,value}` modifient/lisent les contrôles avec validation typée et budgets page/label, sans modifier actions ni autorisation. Dropdowns : 1–64 labels uniques non vides ; l’input est borné à la lecture, sans garantir toute la mémoire des contrôles d’édition système.

La galerie utilise Editing → Review → Applied, révisions, champs bloqués et commands typés par script. Aucun modèle IA connecté. Le runner a physique déterministe, collision/score/restart/pause. L’exemple 3D utilise WebGL système direct, perspective/profondeur et six trajectoires de Lorenz, intégration RK4, 24 576 points bornés, orbite/zoom, isolation de trajectoire, pause et avance par pas ; ce n’est pas un moteur 3D natif Rust.

Les quatre exemples ont été rendus et utilisés dans de vraies fenêtres macOS ; fermer chacun termine 0 avec zéro fenêtre retenue. La proposition composants/IA est un roadmap, pas un protocole tools implémenté.

## Installation et documentation

```toml
[dependencies]
appcore-ui = { version = "=0.1.0-beta.1", features = ["web-macos"] }
```

Le paquet publié inclut le client compilé du bridge : exécuter `web_bridge` ne nécessite ni Node ni build npm. Les étapes npm des guides de développement source servent uniquement à recompiler ce client. Exécutez les exemples Cargo depuis le crate extrait ou le workspace source Runtime.

[crates.io](https://crates.io/crates/appcore-ui/0.1.0-beta.1) · [API](https://docs.rs/appcore-ui/0.1.0-beta.1/appcore_ui/)

- [Guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/guide.fr.md)
- [Basic](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/examples/basic.fr.md)
- [Intermediate](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ui/wiki/examples/intermediate.fr.md)

## Réactivité des interactions

Le pump sert le run loop sous charge d’input et le bridge avant/après dispatch natif. Le drainage s’arrête si la file d’activations est pleine ; consommez `pending_activations` par `next_activation` après pump. Tracking/callbacks système peuvent dépasser le budget coopératif. La WebView accepte le premier clic physique activant une fenêtre inactive ; changement de focus, pas d’autorisation. Les tests physiques ont reçu dix actions sur dix dans les exemples natif/web, plus un clic en changeant de fenêtre.
