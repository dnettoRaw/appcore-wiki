---
title: appcore-ai — 0.1 beta
sidebar_position: 23
---

# appcore-ai

:::caution Beta publique
`appcore-ai 0.1.0-beta.3` est publié sur crates.io. L'API peut changer pendant
la beta et docs.rs peut prendre du temps pour terminer le build d'une nouvelle
release. Elle n'ajoute aucun champ aux manifests V1 stables.
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
| Ressources | snapshots natifs CPU/RAM, topologie unifiée/dédiée, admission device exact, sampling single-flight, batching et résidence |
| Artefacts | taille + SHA-256, cache atomique no-follow/revalidé, provenance et ranges vérifiés |
| Génératif | chat avec rôles, sampling, tool calls récupérables, JSON Schema, contrats streaming et data URLs image opt-in |
| ML local | Candle CPU et entraînement du classificateur data-only `NativeLinearV1` |
| Opérations | annulation, deadlines, health et télémétrie sans payload |
| Distribué | contrats Swarm expérimentaux, aucun adapter Peer RPC production revendiqué |

La compilation par défaut n'inclut ni framework ML ni adapter HTTP.
La normalisation lightweight des espaces Unicode écrit directement dans sa
`String` de sortie bornée, sans retenir une liste intermédiaire de mots.

L'activation du cache local reste aussi bornée en mémoire lorsque l'artefact
existe déjà. Les stores idempotents et les courses entre writers ouvrent le
fichier régulier sans suivre les liens, vérifient sa taille exacte, le comparent
et calculent SHA-256 incrémentalement avec un buffer fixe de 16 Kio. L'artefact
complet owned par le caller n'est pas dupliqué.

Le classificateur Candle optionnel déplace labels, poids et biais décodés dans
l'état chargé sans cloner les buffers complets. `CandleBackend` réserve
atomiquement un slot et les octets déclarés avant l'accès au store.
`new_with_loaded_byte_limit` choisit un plafond agrégé inférieur et
`memory_pressure()` expose usage courant/de pic et loads rejetés. Une inférence
active conserve sa réservation après `unload` jusqu'à la libération de son
lease des tensors. Candle n'a pas de KV cache génératif ; le moteur génératif
externe choisi doit borner son propre cache.

## Backends et modèles acceptés

| Feature | Moteur/format | Portée réelle |
| --- | --- | --- |
| aucune | resolver lightweight | normalisation, matching, extraction et règles |
| `accelerator-nvidia` | NVIDIA NVML | découverte VRAM/utilisation optionnelle en lecture seule sous Linux/Windows ; aucun pilote installé/contrôlé |
| `backend-candle` | `NativeLinearV1` | classification CPU in-process |
| `training-candle` | `NativeLinearV1` | SGD reproductible, checkpoint et reprise |
| `backend-openai-compatible` | llama.cpp, MLX-LM, vLLM, SGLang, TensorRT-LLM, OpenVINO, TabbyAPI, generic | chat-completions borné ; SSE natif exige un transport streaming |
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

### Changements OpenAI-compatible de la beta.2

- les réponses non-2xx conservent le statut HTTP exact et le délai
  `Retry-After` borné ; le routage ne retente que les échecs transitoires ;
- les arguments tool call mal formés restent disponibles en JSON brut, avec
  finish reason, usage et nombre d'arguments invalides ;
- la SPI transport retourne des futures et le client HTTP bloquant intégré
  passe par une porte de workers bornée sans bloquer l'exécuteur async ;
- les profils explicites peuvent omettre le sampling, choisir le champ de
  limite de tokens et ajouter des paramètres provider bornés non réservés ;
- la sortie JSON Schema emploie `response_format` natif ou un fallback texte
  JSON explicite et borné ;
- `resolve_stream` fournit annulation coopérative et backpressure par le sink.
  SSE natif n'est actif que si le déploiement et son transport personnalisé le
  déclarent et l'implémentent. Après un événement, un échec transitoire est
  retourné sans mélanger la sortie d'une route fallback.

Le décodeur borné analyse les frames SSE complets et coalescés directement
depuis les chunks empruntés au transport. Il ne retient qu'une queue incomplète
entre les appels et compacte le buffer en attente une fois par chunk, sans
`Vec` temporaire ni déplacement répété du body pour chaque frame.

Le travail est suivi publiquement dans
[l'issue #1](https://github.com/dnettoRaw/app-core-public/issues/1).

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

`ModelRegistryLimits` rend la rétention de metadata explicite : modèles,
localisations par modèle, total des localisations et octets comptabilisés ont
des plafonds configurables sous des maxima de sécurité fixes. Les itérateurs
initiaux et ajouts ultérieurs excessifs échouent avant rétention ou
copy-on-write, tandis que les doublons restent idempotents.
`ModelRegistry::pressure` expose comptes/octets courants et de pic ainsi que
les rejets sans labels de haute cardinalité.

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

## Ressources matérielles réelles

```bash
cargo run -p appcore-ai --example hardware_report
cargo run -p appcore-ai --example hardware_report \
  --features accelerator-nvidia
```

`SystemHardwareProbe::default()` utilise un cache à la demande d'une seconde en
single-flight : aucun thread de polling lorsque AppCore AI est inactif. Il lit
topologie/charge CPU, CPU du processus et RAM disponible via les API natives de
macOS, Linux et Windows. Apple Silicon est un GPU intégré partageant le pool
RAM. Linux offre une découverte DRM sysfs best-effort AMD/NVIDIA ; la feature
optionnelle `accelerator-nvidia` charge dynamiquement la NVML système pour la
VRAM totale/libre/utilisée et l'utilisation du GPU NVIDIA exact.

Une métrique inconnue reste `None`, jamais zéro ou illimitée. Deux GPU ne sont
pas additionnés pour loger un modèle : admission, charge et VRAM libre utilisent
le `DeviceId` exact. La mémoire unifiée est débitée une fois, sans faux pools
RAM + VRAM. `Eco`, `Balanced`, `Performance`, `Unrestricted` et `Custom`
calculent leur marge volontaire depuis la disponibilité et appliquent une
hystérésis sous pression. Le même budget borne batching, résidence,
entraînement et contribution Swarm explicite.

L'exécution de référence couvre macOS arm64 sur Apple M1. Les probes
Linux/Windows, dont NVML optionnel, compilent et ont des tests déterministes,
mais aucune certification physique dans cette passe. Sysfs AMD est partiel ;
thermique/utilisation hors sources documentées et NPU restent indisponibles,
non simulés.

## Chat et appels de tools

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

## Images et documents

Une image n'est transportée que si backend et modèle déclarent ce support. PDF
est une modalité document pour le routage, mais la beta n'embarque ni parseur,
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

La feature `appcore-sdk/ai` expose les contrats neutres de backend à
l'application. Le déploiement configure `AiRuntime` et possède démarrage
required/optional, health, arrêt des admissions, annulation et shutdown borné :

```rust
use appcore_sdk::ai::{AiRequest, AiTask};

let request = AiRequest::new(AiTask::Chat, "Résumez cette entrée bornée")?;
let response = ai_runtime.execute(request)?;
```

La policy de déploiement échoue sans modèle/backend obligatoire utilisable.
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

## Performance et état beta

Le benchmark répétable `perf_lab` produit une sortie humaine ou JSONL et couvre
lightweight, routage, scaling registre/scheduler, batching, artefacts,
Candle/training et 1–1 000 candidats Swarm. Sur l'Apple M1 documenté, resolve
chaud à 32 routes passe de 96,417 us à 21,958 us p50 et batch Candle 32 de
68,959 us à 31,041 us. Le rapport conserve aussi les régressions petit batch et le
coût volontaire de la protection no-follow.

Un workload séparé de 65 536 localisations peer retenait auparavant toutes les
entrées et atteignait 7,83 Mio de RSS pic/retenu. Avec l'admission bornée, il
retient le maximum par défaut de 128 par modèle, rejette explicitement le reste
et a mesuré 1,91 Mio de RSS pic (-75,61 %) et 1,89 Mio retenu (-75,86 %) sur
cinq processus Apple M1.

Pour un classificateur Candle représentatif de 4 Mio, déplacer les buffers
décodés et réserver la mémoire avant lecture a réduit la médiane de cinq
processus de 1,701 à 1,368 ms (-19,56 %) et le RSS pic médian de 20,16 à
16,11 Mio (-20,08 %).

Pour une entrée lightweight de 1 Mio avec 524 288 mots d'un octet, supprimer le
`Vec<&str>` intermédiaire a réduit la médiane de cinq processus de 4,823 à
3,337 ms (-30,80 %) et le RSS pic médian de 12,98 à 3,88 Mio (-70,16 %).

Le verdict local est **READY FOR BETA** dans le périmètre documenté. Exécution
physique Windows/Linux, soak réel sur accélérateurs et adapter Swarm Peer RPC
production restent des preuves du programme beta. L'isolation processus relève
du déploiement et la composition déclarative reste post-1.0 ; cette beta ne les
revendique pas.

## Sécurité, limites et état

- prompts, outputs, endpoints et credentials sont expurgés des diagnostics ;
- LocalOnly refuse les permissions distantes, qui exigent des grants tenant ;
- files, tentatives, peers, payloads, metadata, tools et artefacts sont bornés ;
- l'annulation est coopérative ; le worker bloquant borné la transmet à
  l'échange HTTP et les transports streaming la vérifient entre chunks ;
- le modèle exige taille exacte et SHA-256 avant activation ;
- `Unrestricted` ne désactive pas les protections OS ou matérielles.

La release beta.2 définit le streaming, mais le HTTP intégré reste en réponse complète ;
le transport du déploiement doit implémenter SSE natif explicitement. PDF/OCR,
installation/sandbox automatique du moteur, Swarm production et manifests
déclaratifs restent hors de cette beta. Consultez [guide.fr.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/guide.fr.md),
[basic.fr.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/examples/basic.fr.md) et
[intermediate.fr.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/examples/intermediate.fr.md)
pour APIs et exemples. Le [guide exact des ressources](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/resources.fr.md)
documente matrice de plateforme, coût de dépendance, fit modèle et métriques
opérationnelles. Le [rapport performance](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/benchmarks.fr.md)
et la [matrice beta](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/release-readiness.fr.md)
sont versionnés avec le crate.
