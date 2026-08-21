---
title: appcore-ai — 0.1 alpha
sidebar_position: 23
---

# appcore-ai

:::caution Alpha disponible dans les sources
`appcore-ai` est implémenté dans le workspace AppCore Runtime en
`0.1.0-alpha`, mais n'est pas encore publié sur crates.io ou docs.rs. L'API peut
changer pendant l'alpha et n'ajoute aucun champ aux manifests V1 gelés.
:::

`appcore-ai` est le core d'exécution IA borné et indépendant du backend. Il
choisit une route à partir de modèles, backends, devices, ressources et policy
de confidentialité explicites. L'application reste propriétaire des prompts,
de la validation métier et de toute décision d'appliquer un résultat généré.

## Ce qui est implémenté

| Zone | Comportement actuel |
| --- | --- |
| API centrale | requêtes/réponses typées, texte/chat/image/document, qualité et confidentialité |
| Chemin rapide | transformations et règles lightweight déterministes, sans ML |
| Routage | coût local/distant, escalade bornée, load single-flight par modèle/backend |
| Ressources | admission CPU/RAM/VRAM, file équitable bornée, planners batching/résidence |
| Artefacts | taille + SHA-256, cache atomique, provenance et ranges vérifiés |
| Génératif | chat avec rôles, sampling, tools/tool calls et data URLs image opt-in |
| ML local | Candle CPU et entraînement du classificateur data-only `NativeLinearV1` |
| Opérations | annulation, deadlines, health et télémétrie sans payload |
| Distribué | contrats Swarm expérimentaux, aucun adapter Peer RPC production revendiqué |

La compilation par défaut n'inclut ni framework ML ni adapter HTTP.

## Backends et modèles acceptés

| Feature | Moteur/format | Portée réelle |
| --- | --- | --- |
| aucune | resolver lightweight | normalisation, matching, extraction et règles |
| `backend-candle` | `NativeLinearV1` | classification CPU in-process |
| `training-candle` | `NativeLinearV1` | SGD reproductible, checkpoint et reprise |
| `backend-openai-compatible` | llama.cpp, MLX-LM, vLLM, SGLang, TensorRT-LLM, OpenVINO, TabbyAPI, generic | chat-completions borné sans streaming |
| `swarm` | bridge fournie par le host | contrat authentifié expérimental |

L'adapter OpenAI-compatible reconnaît GGUF pour llama.cpp, ONNX pour OpenVINO
et SafeTensors pour les autres profils. Le serveur externe interprète et
exécute ces formats. Enregistrer un format n'installe jamais un moteur et ne
télécharge jamais un modèle silencieusement.

## Exécuter un LLM local

Démarrez séparément un serveur compatible. Exemple de listener loopback
llama.cpp :

```bash
llama-server -m /chemin/absolu/modele.gguf --host 127.0.0.1 --port 8080
```

Puis exécutez l'exemple avec l'identité exacte de l'artefact :

```bash
APPCORE_AI_ENGINE=llama.cpp \
APPCORE_AI_FORMAT=gguf \
APPCORE_AI_BASE_URL=http://127.0.0.1:8080 \
APPCORE_AI_MODEL=nom-exact-du-serveur \
APPCORE_AI_MODEL_SHA256=<digest-hexadecimal-64-caracteres> \
APPCORE_AI_MODEL_BYTES=<taille-exacte-du-fichier> \
cargo run -p appcore-ai --example openai_compatible \
  --features backend-openai-compatible
```

Valeurs moteur acceptées : `llama.cpp`, `mlx-lm`, `vllm`, `sglang`,
`tensorrt-llm`, `openvino`, `tabbyapi` et `generic`. Chaque configuration lie
un `ModelId` AppCore au nom exact compris par le serveur. Tools, vision, seed et
stop restent désactivés tant que le déploiement exact ne les déclare pas.

`OpenAiCompatibleConfig::local` refuse les endpoints hors loopback. Un
déploiement distant emploie `OpenAiCompatibleConfig::remote` et un transport
personnalisé fondé sur les références de secrets et la policy AppCore. Le
transport intégré refuse les credentials.

## Modèle d'exécution adaptatif

La forme conceptuelle côté application est :

```rust
let output = app.ai().resolve(request).await?;
```

Sous cette façade, `appcore-ai` garde la sélection de modèle explicite. Un model
registry relie identité du modèle, provenance d'artefact, support backend,
modalité, qualité, confidentialité et exigences de ressources. Les backends
décident comment exécuter la request, mais le runtime possède encore admission,
annulation, health, observabilité et policy.

L'exécution peut être locale, distante ou déléguée à un swarm expérimental :

```rust
enum AiExecutionMode {
    Local,
    Swarm,
    Auto,
}
```

`Auto` peut router ou escalader entre options autorisées, mais seulement dans la
policy déclarée. Il ne doit jamais déplacer silencieusement une request
local-only vers du compute distant.

Les profils de ressources décrivent la marge volontaire AppCore :

- `Eco` : préférer énergie et mémoire plus basses ;
- `Balanced` : compromis par défaut entre throughput et latence ;
- `Performance` : admettre une exécution locale ou distante plus agressive ;
- `Unrestricted` : retire les limites volontaires AppCore, mais respecte encore
  les protections matériel, firmware, driver et système d'exploitation.

Compute et storage sont séparés :

```text
COMPUTE: CPU / GPU / NPU / remote
STORAGE: VRAM / RAM / NVMe / peer
```

Un node peut contribuer compute, storage, les deux ou aucun. Le design swarm a
donc besoin de contribution policy, contrôles d'intégrité, health, failover et
accounting clair avant de devenir un comportement production.

## Chat, tools, images et PDF

```rust
let request = AiRequest::chat(
    [
        AiMessage::new(AiMessageRole::System, "Répondez brièvement.")?,
        AiMessage::new(AiMessageRole::User, "Expliquez l'IA local-first.")?,
    ],
    AiLimits::default(),
)?;
let response = runtime.resolve(request).await?;
```

Un tool possède un nom, une description et un JSON Schema bornés.
`AiOutput::ToolCalls` n'est qu'une proposition : l'application valide les
arguments et route le travail autorisé via `appcore-capabilities`. Le texte
généré n'est jamais une autorité d'écriture.

Une image n'est transportée que si backend et modèle déclarent ce support. PDF
est une modalité document pour le routage, mais l'alpha n'embarque ni parseur,
rasterizer ni OCR universel. L'application choisit un processor borné en pages,
pixels, octets décompressés, temps et sortie.

## Configurer ou entraîner

Les LLM génératifs sont configurés, pas entraînés, par ce crate : exécutez le
moteur, enregistrez métadonnées et identité exactes, déclarez les capabilities,
puis laissez `AiRuntime` router. Fine-tuning et conversion appartiennent au
moteur.

Le trainer implémenté est volontairement plus petit : classification locale
`NativeLinearV1` :

```bash
cargo run -p appcore-ai --example candle_training \
  --features training-candle
```

Le job borne labels, dimensions, dataset, epochs, steps, batch, learning rate,
seed, CPU/RAM et checkpoints. Le résultat contient les octets, le SHA-256 et un
`ModelDescriptor` prêt pour le registry. Ce n'est pas du fine-tuning LLM.

## Intégration application AppCore

La feature `appcore-bin/ai-alpha` enveloppe un `AiRuntime` configuré dans
`AppCoreAiComponent`. Le Supervisor existant possède démarrage
required/optional, health, arrêt des admissions, annulation et shutdown borné :

```rust
let component = Arc::new(AppCoreAiComponent::new(Arc::new(ai_runtime), false)?);
let ai = component.facade();
let business = MonApplication::new(ai);
ManifestApplicationHost::load("application.toml", "deployment.toml", &business)?
    .with_ai(component)
    .run()?;
```

`required = true` fait échouer le démarrage sans modèle/backend utilisable.
Exposer `appcore.ai.resolve` via `appcore-capabilities` exige un
`AiCapabilityCodec` explicite et borné. La sélection déclarative attend un
contrat versionné post-1.0.

## Choisir un moteur

- llama.cpp : GGUF portable et exécution CPU/GPU hybride ;
- MLX-LM : Apple Silicon ;
- TabbyAPI/ExLlama : GPU NVIDIA grand public, faible concurrence ;
- vLLM ou SGLang : serving à forte concurrence ;
- TensorRT-LLM : déploiements NVIDIA optimisés ;
- OpenVINO : Intel CPU/GPU/NPU ;
- Candle : uniquement le petit classificateur inclus, pas un LLM génératif.

Mesurez ensemble version moteur, révision, quantification, contexte, batch et
device. Conservez cold start, TTFT, tokens/s, requests/s, RAM, VRAM, file et
échecs. Aucun moteur n'est universellement le plus rapide.

## Sécurité, limites et état

- prompts, outputs, endpoints et credentials sont expurgés des diagnostics ;
- LocalOnly refuse les permissions distantes, qui exigent des grants tenant ;
- files, tentatives, peers, payloads, metadata, tools et artefacts sont bornés ;
- l'annulation est coopérative ; HTTP bloquant vérifie avant/après l'échange ;
- le modèle exige taille exacte et SHA-256 avant activation ;
- `Unrestricted` ne désactive pas les protections OS ou matérielles.

Streaming de tokens, PDF/OCR, installation/sandbox automatique du moteur,
Swarm production et manifests déclaratifs ne sont pas livrés dans
`0.1.0-alpha`. Consultez `crates/appcore-ai/wiki` dans le dépôt Runtime pour les
API, exemples, modèles, benchmarks, threat model et gates complets.
