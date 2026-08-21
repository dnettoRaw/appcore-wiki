---
title: appcore-ai — Bientôt disponible
sidebar_position: 23
---

# appcore-ai

:::caution Bientôt disponible
`appcore-ai` est en cours de développement et **n'est pas encore publié**. Il
n'est actuellement disponible ni sur crates.io ni sur docs.rs et ne doit pas
être utilisé comme dépendance.
:::

`appcore-ai` est le crate prévu pour la prise en charge de l'IA dans AppCore. Il
vise à intégrer l'accès aux modèles, l'exécution de prompts, les appels d'outils,
les frontières de mémoire et l'observabilité runtime dans le même modèle
manifest-first que le reste d'AppCore.

Le crate ne doit pas rendre le comportement IA magique ou implicite. Le code
applicatif reste propriétaire des décisions produit, des règles métier et de
l'expérience utilisateur. `appcore-ai` possède la frontière runtime autour du
travail IA : ce qui peut s'exécuter, quel provider est sélectionné, comment les
secrets sont résolus, comment les appels sont tracés et quelles capabilities un
modèle peut invoquer.

## Responsabilité

`appcore-ai` est prévu pour couvrir :

- contrats de providers pour chat, completion, embeddings et génération structurée ;
- enveloppes de prompt et de request avec entrée bornée, métadonnées et trace context ;
- sélection de provider par configuration de deployment ;
- intégration des tool calls avec `appcore-capabilities` ;
- contrôles de policy pour l'accès modèle, les écritures et les contextes sensibles ;
- adapters locaux et distants sans coupler l'application à un SDK vendor ;
- frontières optionnelles de mémoire et retrieval en gardant les données métier côté application ;
- événements d'observabilité pour cycle de vie de request, latence, usage, échecs et décisions de policy.

Il ne doit pas posséder les prompts métier, les agents propres à une
application, les modèles de données client, les flux UI ou les règles
d'automatisation produit. Ces éléments restent dans le code applicatif.

## Frontière Runtime

La frontière prévue suit la même séparation que le reste d'AppCore :

| Propriétaire | Possède | Ne possède pas |
| --- | --- | --- |
| Application manifest | déclare les capabilities IA nécessaires | provider IDs, API keys, endpoints |
| Deployment manifest | choisit provider, famille de modèle, limites et secret refs | prompts métier ou policy de domaine |
| Code applicatif | construit les prompts, valide l'intention métier, traite les réponses | wiring provider, chargement des secrets, fallback |
| `appcore-ai` | valide les requests, appelle les providers, enregistre les traces, applique la policy IA | décisions applicatives ou effets de bord cachés |

La règle importante est l'explicite. Un deployment qui veut un provider distant
compatible OpenAI, un runtime de modèle local, une gateway privée ou un fake de
test doit choisir ce provider délibérément. Les providers absents ou
incompatibles doivent échouer au startup ou à la validation de request, sans
fallback silencieux.

## Concepts Prévus

### Providers IA

Les providers doivent exposer un petit contrat runtime plutôt qu'un SDK propre à
un vendor. Un provider peut prendre en charge une ou plusieurs opérations :

- génération conversationnelle ;
- completion de prompt unique ;
- sortie JSON structurée ;
- embeddings ;
- ranking ou reranking ;
- modération ou classification de sécurité ;
- réponses en streaming.

Chaque provider doit documenter authentification, timeouts, retries, limites de
payload, modèles supportés, garanties de streaming, persistance et règles de
redaction.

### Profils de modèle

Un profil de modèle est la description, côté deployment, du choix de modèle. Il
peut représenter un modèle distant hébergé, un serveur local d'inférence, une
gateway spécifique à un tenant ou un fake utilisé en tests.

Les profils sont prévus pour garder le choix du modèle hors du code métier. Le
code applicatif doit demander une capability déclarée, comme résumé, extraction,
classification ou planification assistée par outils. Le deployment décide quel
modèle concret satisfait cette capability.

### Enveloppes de prompt

L'exécution de prompt doit passer par une enveloppe contenant :

- application ID, installation ID et trace ID ;
- capability demandée ;
- payload d'entrée et forme de sortie déclarée ;
- métadonnées de sécurité et de classification des données ;
- timeout, taille et préférences de streaming ;
- idempotency ou mode d'opération quand la request peut déclencher des outils.

Cela donne au runtime assez de contexte pour rejeter les entrées trop grandes,
attacher l'observabilité, appliquer la policy et éviter les écritures
opérationnelles accidentelles.

### Tool calls

Les tool calls doivent utiliser le modèle existant de capabilities au lieu de
donner au modèle un accès direct aux internals arbitraires de l'application. Un
modèle peut proposer un appel d'outil, mais AppCore doit le router via des
descriptors déclarés, l'autorisation et les contrôles de mode d'écriture.

Le flux prévu est :

1. Le code applicatif soumet une request IA avec un ensemble d'outils autorisés.
2. `appcore-ai` envoie la request au provider sélectionné.
3. Le provider retourne du texte, des données structurées ou une proposition de tool call.
4. `appcore-ai` valide la tool call proposée contre le catalogue de capabilities.
5. L'application ou le runtime exécute seulement les capabilities autorisées.
6. Les résultats retournent au modèle ou au code applicatif selon le flux déclaré.

Une sortie IA n'est jamais une autorité en soi. Le code métier valide encore les
actions proposées avant de modifier l'état métier.

### Mémoire et retrieval

`appcore-ai` peut fournir des contrats runtime pour retrieval et mémoire, mais
ne doit pas transformer le storage AppCore en base vectorielle générique. La
frontière prévue est :

- embeddings et requests de retrieval passent par des contrats provider ;
- le code applicatif possède les données indexées ;
- le deployment choisit où les index vivent ;
- secrets et credentials restent dans la configuration provider ;
- la mémoire persistée doit être scopée par application, tenant et policy.

La mémoire long terme doit être explicite et inspectable. Le crate doit éviter
la mémoire cachée entre tenants, l'accumulation non bornée de prompts et les
canaux provider qui contournent le storage et la policy de sécurité AppCore.

## Modèle de Sécurité

Les appels IA traversent une frontière à haut risque parce que les prompts
peuvent contenir contenu utilisateur, données privées, instructions générées et
résultats d'outils. `appcore-ai` est prévu pour traiter cette frontière comme
infrastructure runtime.

Le crate doit appliquer ou exposer des hooks pour :

- secret refs au lieu d'API keys inline ;
- logs compatibles avec la redaction ;
- limites de taille request et response ;
- limites de timeout et retry ;
- scope tenant et installation ;
- contrôles de policy avant les appels distants ;
- allowlists explicites pour les tool calls ;
- contrôles write-mode et leadership avant les actions opérationnelles ;
- raisons auditables lorsqu'une request est rejetée.

Les applications ont encore besoin de leurs propres règles de sécurité produit.
Le runtime peut appliquer des frontières mécaniques, mais il ne peut pas décider
si une réponse générée est correcte pour un domaine métier spécifique.

## Observabilité

Le comportement IA a besoin de visibilité opérationnelle sans fuite de prompts
par défaut. La surface d'observabilité prévue doit enregistrer :

- provider et profil de modèle sélectionnés ;
- début de request, progression de stream et completion ;
- latence, timeout et nombre de retries ;
- tokens, unités ou coûts quand le provider les expose ;
- décisions de policy acceptées ou rejetées ;
- propositions de tool call et résultats d'exécution ;
- classes d'erreur redigées.

Le logging brut des prompts et completions doit être opt-in et contrôlé par
policy. Les diagnostics par défaut doivent aider les opérations sans stocker du
contenu sensible par accident.

## Forme D'utilisation

L'API Rust publique n'est pas finale, mais la forme d'utilisation prévue est :

```rust
// Forme conceptuelle uniquement. appcore-ai n'est pas encore publié.
let answer = app.ai()
    .capability("notes.summarize")
    .input(note_text)
    .expect_json::<Summary>()
    .run()
    .await?;
```

Pour les flux assistés par outils, l'application déclarerait quelles
capabilities peuvent être utilisées :

```rust
// Forme conceptuelle uniquement. appcore-ai n'est pas encore publié.
let plan = app.ai()
    .capability("orders.assistant")
    .allow_tool("orders.quote.read")
    .allow_tool("orders.quote.propose_update")
    .input(user_request)
    .run()
    .await?;
```

Ces exemples décrivent l'orientation, pas une API stable.

## Forme De Deployment

Un futur deployment manifest pourra sélectionner l'infrastructure IA comme les
autres providers :

```toml
# Forme conceptuelle uniquement. appcore-ai n'est pas encore publié.
[providers.ai]
provider_id = "openai-compatible"
model_profile = "business-assistant"
api_key = "env:APPCORE_AI_API_KEY"

[ai.profiles.business-assistant]
chat_model = "configured-by-deployment"
embedding_model = "configured-by-deployment"
timeout_ms = 30000
max_input_bytes = 65536
```

Les clés exactes du manifest ne sont pas stables. L'objectif de design est
stable : les artifacts applicatifs déclarent les besoins IA, les deployments
choisissent l'infrastructure concrète.

## Tests

Le crate doit permettre des tests déterministes sans appels réseau distants. Les
surfaces de test prévues incluent :

- providers fake avec réponses scriptées ;
- fixtures de validation de sortie structurée ;
- tests d'autorisation de tool call ;
- tests de timeout et retry ;
- assertions de redaction et d'observabilité ;
- rejets de policy pour opérations non sûres ou non déclarées.

Les applications doivent tester le comportement métier autour des sorties IA
comme de la logique métier ordinaire. Une réponse de modèle doit être traitée
comme une entrée qui doit encore être validée.

## Limites

- `appcore-ai` ne remplace pas le design produit ni les règles métier.
- Il ne doit pas cacher le choix provider dans le code applicatif.
- Il ne doit pas faire de fallback silencieux vers un modèle plus faible ou moins cher.
- Il ne doit pas stocker prompts, completions ou mémoire sans policy explicite.
- Il ne doit pas donner aux modèles un accès direct en écriture à l'état applicatif.
- Il ne doit pas rendre un contenu généré fiable sans validation.
- L'API, la frontière des dépendances, les clés de manifest, la version, le MSRV et les exemples restent provisoires jusqu'à publication du crate.
