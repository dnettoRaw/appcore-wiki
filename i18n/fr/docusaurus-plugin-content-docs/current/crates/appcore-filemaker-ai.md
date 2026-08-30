---
title: appcore-filemaker-ai — 0.1 alpha
---

# appcore-filemaker-ai

`appcore-filemaker-ai 0.1.0-alpha.1` est le bridge facultatif et borné entre les
outils `appcore-ai` et les sessions FileMaker déterministes. C'est un aperçu
source qui n'est pas publié sur crates.io.

Le bridge déclare 20 outils exacts, borne appels, patches et octets de résultat,
et applique la policy editable/locked du template avant toute mutation
atomique. Les requêtes ne changent pas la revision. Les outils d'artifact
renvoient du base64 borné en mémoire sans choisir de path filesystem.

`filemaker_schema` décrit couleurs typées, chaque couche de cascade, unités et
primitives sémantiques Canvas, ordre de peinture, frontières des résolveurs et
graphiques avancés préparés. `filemaker_add` accepte un élément source strict et
compact identifié par `type`, ou une IR complète identifiée par `kind` ; les
champs nécessitant expansion du compilateur ou binding échouent explicitement.
`filemaker_set` et les patches typés acceptent `set_style` transactionnel ; les
overrides d'export restent limités à la peinture et ne changent pas le layout.

L'inspection accepte un ID d'élément ou une page et renvoie la trace structurée
de géométrie/reflow conservée. L'entrée du masque debug déclare explicitement
page et vue collision/layout/visual/combined, tandis que les régions libres
déclarent leurs dimensions minimales ; ces arguments acceptés ne sont plus
cachés par des schémas vides.

La découverte des capabilities sépare les exporters implémentés des WebP,
XLSX, ZPL, ESC/POS, PDF/A, PDF Hybrid, liens, bookmarks et accessibilité tagged
préparés. Son contrat d'export nomme les writers de l'appelant ou les octets
bornés, les rapports de perte strict/best-effort, le DPI raster uniquement, les
métadonnées PDF déterministes et les subsets de polices du PDF éditable, afin
que le modèle ne déduise pas une sortie indisponible.

Les dépendances AppCore directes sont `appcore-ai` et `appcore-filemaker`. Policy
et orchestration IA restent hors du compilateur déterministe.

Documentation maintenue par le crate : [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.fr.md),
[exemple de base](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.fr.md) et
[exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.fr.md).
