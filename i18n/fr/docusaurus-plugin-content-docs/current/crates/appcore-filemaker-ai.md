---
title: appcore-filemaker-ai — 0.1 alpha
---

# appcore-filemaker-ai

`appcore-filemaker-ai 0.1.0-alpha.1` est le bridge facultatif et borné entre les
outils `appcore-ai` et les sessions FileMaker déterministes. C'est un aperçu
source qui n'est pas publié sur crates.io.

Le bridge déclare 20 outils exacts avec schémas fermés identiques à l'exécution,
borne appels, arguments, patches également plafonnés par le core et octets de
résultat, puis applique la policy editable/locked du template aux subtrees
destructifs avant toute mutation atomique. Les documents candidats sont validés
et résolus avant commit ; la séquence de patch est la prochaine revision. Les
requêtes ne changent pas la revision. Les outils d'artifact renvoient du base64
borné en mémoire sans choisir de path filesystem.

Les capabilities fournissent les appels restants et un contexte compact des
purpose/rules et IDs editable/locked. Remplacer un document de confiance
remplacerait aussi cette policy auteur ; `load` exige donc l'opt-in explicite du
host via `allow_document_replacement`, faux par défaut. Les loads et patches en
échec préservent état et revision.

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

`filemaker_validate` renvoie les issues layout bornées et la troncature
explicite. `filemaker_preflight` déclare ses véritables entrées format,
fidelity, mode, page, DPI, strict et accessibilité. La découverte du schéma
nomme les quatre étapes de validation, les entrées complètes du fingerprint et
le cache immuable resolve-on-miss.

Les outils debug-mask et régions libres transmettent les limites core de la
session à la géométrie diagnostique bornée, empêchant le bridge optionnel de
contourner les budgets de comparaisons ou de géométrie conservée.

Les dépendances AppCore directes sont `appcore-ai` et `appcore-filemaker`. Policy
et orchestration IA restent hors du compilateur déterministe.

Documentation maintenue par le crate : [guide](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/guide.fr.md),
[exemple de base](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/basic.fr.md) et
[exemple intermédiaire](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker-ai/wiki/examples/intermediate.fr.md).
