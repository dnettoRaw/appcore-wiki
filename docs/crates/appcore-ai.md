---
title: appcore-ai — 0.1 beta
sidebar_position: 23
---

# appcore-ai

:::caution Public beta
`appcore-ai 0.1.0-beta.3` is published on crates.io. Its API may change during
the beta line, and docs.rs may take time to finish a new release build. It does
not add fields to stable V1 manifests.
:::

`appcore-ai` is the bounded, backend-neutral AI execution core for AppCore. It
chooses a route from explicit models, backends, devices, resource policy and
privacy constraints. Applications still own prompts, domain validation and the
decision to apply any generated result.

## What is implemented

| Area | Current behavior |
| --- | --- |
| Core API | typed requests/responses, text/chat/image/document modalities, quality and privacy policy |
| Fast path | deterministic lightweight transformations and rules, with no ML dependency |
| Routing | cost-aware local/remote planning, bounded escalation and per-model/backend single-flight load |
| Resources | native CPU/RAM snapshots, unified/dedicated device topology, exact-device admission, single-flight sampling, adaptive batching and residency |
| Artifacts | exact size + SHA-256, no-follow/revalidated atomic cache, provenance and verified ranges |
| Generative | role-aware chat, sampling, recoverable tool calls, JSON Schema output, streaming contracts and opt-in image data URLs |
| Local ML | optional Candle CPU inference and training for the data-only `NativeLinearV1` classifier |
| Operations | cancellation, deadlines, health summaries and payload-free metrics/observations |
| Distributed | experimental Swarm contracts; no production Peer RPC adapter is claimed |

The default feature set contains no ML framework or HTTP adapter.
Lightweight Unicode whitespace normalization writes directly into its bounded
output `String`; it does not retain an intermediate list of every input word.

Local cache activation is also memory-bounded when the artifact already
exists. Idempotent stores and concurrent writer races open the regular file
without following links, verify its exact size, compare it and calculate
SHA-256 incrementally with a fixed 16 KiB buffer. They do not duplicate the
complete caller-owned artifact.

The optional Candle classifier moves decoded labels, weights and biases into
loaded state without cloning the complete buffers. `CandleBackend` atomically
reserves a model slot and declared artifact bytes before store access.
`new_with_loaded_byte_limit` selects a tighter aggregate ceiling and
`memory_pressure()` reports current/peak usage and rejected loads. An active
inference keeps its reservation after `unload` until its tensor lease drops.
Candle has no generative KV cache; the selected external generative engine must
bound its own cache.

## Backend and model support

| Feature | Engines or format | Actual scope |
| --- | --- | --- |
| none | lightweight resolver | normalization, matching, extraction and rule-driven answers |
| `accelerator-nvidia` | NVIDIA NVML | optional read-only VRAM/utilization discovery on Linux/Windows; no driver install or control |
| `backend-candle` | `NativeLinearV1` | in-process CPU classification |
| `training-candle` | `NativeLinearV1` | reproducible bounded SGD, checkpoint and resume |
| `backend-openai-compatible` | llama.cpp, MLX-LM, vLLM, SGLang, TensorRT-LLM, OpenVINO, TabbyAPI, generic server | bounded chat completions; native SSE requires a streaming transport implementation |
| `swarm` | host-supplied bridge | authenticated planning/execution contract, experimental |

The OpenAI-compatible adapter recognizes GGUF for llama.cpp, ONNX for
OpenVINO, and SafeTensors for the other listed profiles. The external server,
not `appcore-ai`, parses and executes those formats. Registering a format never
silently installs an engine or downloads a model.

## Run a local generative model

First start a compatible server separately. A llama.cpp deployment commonly
uses a loopback listener like this:

```bash
llama-server -m /absolute/path/model.gguf --host 127.0.0.1 --port 8080
```

Then run the executable AppCore example with the real artifact identity:

```bash
APPCORE_AI_ENGINE=llama.cpp \
APPCORE_AI_FORMAT=gguf \
APPCORE_AI_BASE_URL=http://127.0.0.1:8080 \
APPCORE_AI_MODEL=my-server-model-name \
APPCORE_AI_MODEL_SHA256=<64-hex-digest> \
APPCORE_AI_MODEL_BYTES=<exact-file-size> \
cargo run -p appcore-ai --example openai_compatible \
  --features backend-openai-compatible
```

Accepted engine values are `llama.cpp`, `mlx-lm`, `vllm`, `sglang`,
`tensorrt-llm`, `openvino`, `tabbyapi`, and `generic`. Each
`OpenAiCompatibleConfig` binds one AppCore `ModelId` to the exact model name
understood by that server. Tools, vision, seed and stop support are disabled
until the exact deployment declares them.

`OpenAiCompatibleConfig::local` rejects non-loopback endpoints. A remote
deployment must use `OpenAiCompatibleConfig::remote` and a custom
`OpenAiCompatibleTransport` backed by AppCore secret references and policy.
The built-in unauthenticated transport rejects credentials.

### OpenAI-compatible changes in beta.2

- non-2xx responses preserve the exact HTTP status and bounded `Retry-After`
  delta, so routing retries only transient failures;
- malformed tool-call arguments remain available as raw JSON together with
  finish reason, usage and an invalid-argument count;
- the transport SPI returns futures, while the built-in blocking HTTP client is
  moved to a bounded worker gate instead of blocking an async executor;
- explicit compatibility profiles can omit sampling fields, select the token
  limit field and add bounded non-reserved provider parameters;
- JSON Schema structured output supports either native `response_format` or an
  explicit bounded JSON-text fallback;
- `resolve_stream` provides cooperative cancellation and sink-driven
  backpressure. Native SSE is enabled only when the selected deployment and its
  custom transport both declare and implement streaming. After an event is
  emitted, a transient failure is returned instead of mixing a fallback route's output.

The bounded decoder parses complete coalesced SSE frames directly from borrowed
transport chunks. It retains only an incomplete tail between calls and compacts
an accumulated pending buffer once per chunk, without a temporary `Vec` or
repeated body shift for every frame.

These changes are tracked publicly in
[issue #1](https://github.com/dnettoRaw/app-core-public/issues/1).

## Adaptive execution model

The conceptual application-facing shape is:

```rust
let output = app.ai().resolve(request).await?;
```

Under that facade, `appcore-ai` keeps model selection explicit. A model registry
binds model identity, artifact provenance, backend support, modality, quality,
privacy and resource requirements. Backend SPI implementations decide how to
execute a request, but the runtime still owns admission, cancellation, health,
observability and policy.

`ModelRegistryLimits` makes metadata retention explicit: models, locations per
model, aggregate locations and accounted location bytes all have configurable
ceilings below fixed safety maxima. Oversized initial iterators and later
additions fail before retention or copy-on-write, while duplicate additions
remain idempotent. `ModelRegistry::pressure` exposes current/peak counts and
bytes plus rejected admissions without high-cardinality labels.

Execution can be local, remote or delegated to an experimental swarm:

```rust
enum AiExecutionMode {
    Local,
    Swarm,
    Auto,
}
```

`Auto` may route or escalate across allowed options, but only inside declared
policy. It should never silently move a local-only request to remote compute.

Resource profiles are intended to describe voluntary AppCore headroom:

- `Eco`: prefer lower energy and smaller memory footprint;
- `Balanced`: default throughput and latency trade-off;
- `Performance`: admit more aggressive local or remote execution;
- `Unrestricted`: remove voluntary AppCore limits while still respecting
  hardware, firmware, driver and operating-system protections.

Compute and storage are separate concerns:

```text
COMPUTE: CPU / GPU / NPU / remote
STORAGE: VRAM / RAM / NVMe / peer
```

A node may contribute compute, storage, both or neither. Swarm design therefore
needs contribution policy, integrity checks, health reporting, failover and
clear accounting before it can be production behavior.

## Real hardware resources

```bash
cargo run -p appcore-ai --example hardware_report
cargo run -p appcore-ai --example hardware_report \
  --features accelerator-nvidia
```

`SystemHardwareProbe::default()` uses a one-second, on-demand single-flight
cache: no background polling thread runs while AppCore AI is idle. It reads
native CPU topology/load, process CPU and RAM availability on macOS, Linux and
Windows. Apple Silicon is represented as an integrated GPU sharing the RAM
pool. Linux has best-effort DRM sysfs discovery for AMD and NVIDIA; the
optional `accelerator-nvidia` feature dynamically loads the system NVML for
exact NVIDIA total/free/used VRAM and utilization.

Unknown metrics remain `None`, not zero or unlimited. Two GPUs are never
aggregated to fit one model: admission, load and free VRAM are checked on the
exact `DeviceId`. Unified memory is charged once instead of creating fictitious
RAM plus VRAM pools. `Eco`, `Balanced`, `Performance`, `Unrestricted` and
`Custom` calculate voluntary headroom from current availability, with
hysteresis under CPU/GPU/memory/queue pressure. The resulting budget also caps
batching, residency, training and explicitly enabled Swarm contribution.

The current reference execution covers macOS arm64 on Apple M1. Linux and
Windows probes, including optional NVML, compile and have deterministic
contract tests but were not physically certified in this pass. AMD sysfs is
partial; GPU thermal utilization outside the documented sources and all NPU
detection remain unavailable rather than simulated.

## Chat and tool calls

```rust
let request = AiRequest::chat(
    [
        AiMessage::new(AiMessageRole::System, "Answer briefly.")?,
        AiMessage::new(AiMessageRole::User, "Explain local-first AI.")?,
    ],
    AiLimits::default(),
)?;
let response = runtime.resolve(request).await?;
```

Tool declarations carry a bounded name, description and JSON Schema. A returned
`AiOutput::ToolCalls` value is only a proposal: application code must validate
the JSON arguments and route authorized work through `appcore-capabilities`.
Generated text is never authority for a write.

## Images and documents

Image input is transported only when both backend and model declare image
support. The current compatible adapter encodes admitted `image/*` bytes as a
data URL and enforces request limits.

PDF is a first-class document modality for routing, but this beta deliberately
does not embed a universal PDF parser, rasterizer or OCR stack. Applications
must select a bounded document backend that caps pages, pixels, expanded bytes,
time and output. Do not send arbitrary PDFs to the chat adapter and assume they
were parsed.

## Configure or train a model

Generative LLM weights are configured, not trained, by this crate: run the
chosen engine, register exact model metadata and artifact identity, declare its
capabilities, then let `AiRuntime` route requests. Fine-tuning and model
conversion remain engine-owned.

The implemented trainer is intentionally narrower: local text classification
for `NativeLinearV1`. Run its reproducible example:

```bash
cargo run -p appcore-ai --example candle_training \
  --features training-candle
```

The job explicitly bounds labels, hashed input dimensions, dataset size,
epochs, optimizer steps, batch, learning rate, seed, CPU/RAM, checkpoint
frequency and retained checkpoints. Its output contains artifact bytes,
SHA-256 identity and a registry-ready `ModelDescriptor`. This is not LLM
fine-tuning.

## AppCore application integration

Applications enable `appcore-sdk/ai` to consume the backend-neutral contracts.
The deployment configures `AiRuntime` and owns required/optional startup,
health, admission stop, cancellation and bounded shutdown:

```rust
use appcore_sdk::ai::{AiRequest, AiTask};

let request = AiRequest::new(AiTask::Chat, "Summarize this bounded input")?;
let response = ai_runtime.execute(request)?;
```

Deployment policy fails startup when a required model/backend is unavailable. A
caller exposing `appcore.ai.resolve` through `appcore-capabilities` must supply
an explicit bounded `AiCapabilityCodec`; Rust types are not an implicit wire
format. Declarative provider/model selection requires a future versioned
post-1.0 manifest contract.

## Choosing an engine

Measure the complete tuple of engine version, model revision, quantization,
context, batch and device. A practical starting point is:

- llama.cpp for portable GGUF and CPU/GPU hybrid execution;
- MLX-LM for Apple Silicon;
- TabbyAPI/ExLlama for low-concurrency consumer NVIDIA GPUs;
- vLLM or SGLang for high-concurrency accelerator serving;
- TensorRT-LLM for tuned NVIDIA deployments;
- OpenVINO for Intel CPU/GPU/NPU deployments;
- Candle only for the small built-in classifier, not generative LLMs.

Record cold start, time to first token, prompt/decode throughput, requests per
second, RAM, VRAM, queue depth and failures. There is no universally fastest
engine.

## Performance and beta readiness

The repeatable `perf_lab` benchmark emits human output or JSONL and covers the
lightweight path, model routing, registry/scheduler scaling, dynamic batching,
artifacts, Candle/training and 1–1,000 Swarm candidates. On the documented Apple
M1 reference run, warm resolution over 32 routes improved from 96.417 us to
21.958 us p50, and Candle batch 32 from 68.959 us to 31.041 us. The report also
shows small-batch regressions and the intentional cost of no-follow
artifact checks.

A separate 65,536-peer-location pressure workload previously retained every
entry and reached 7.83 MiB peak/retained RSS. With bounded model-location
admission it retains the default maximum of 128 per model, rejects the rest
explicitly, and measured 1.91 MiB peak (-75.61%) and 1.89 MiB retained RSS
(-75.86%) across five Apple M1 processes.

For a representative 4 MiB Candle classifier, moving decoded buffers and
reserving memory before reads reduced five-process median load time from 1.701
to 1.368 ms (-19.56%) and median peak RSS from 20.16 to 16.11 MiB (-20.08%).

For a 1 MiB lightweight input containing 524,288 one-byte words, removing the
intermediate `Vec<&str>` reduced five-process median normalization time from
4.823 to 3.337 ms (-30.80%) and median peak RSS from 12.98 to 3.88 MiB (-70.16%).

The repository-local verdict is **READY FOR BETA** within the documented scope.
Windows/Linux physical execution, sustained real-model accelerator soak and a
production Peer RPC Swarm adapter remain beta-program evidence. Engine process
isolation belongs to the deployment and declarative composition remains
post-1.0 work; neither is claimed by this beta.

## Security and operational limits

- prompts, outputs, endpoints and credentials are redacted from `Debug` and
  low-cardinality observations;
- local-only requests reject remote compute and storage permissions;
- remote routes require explicit tenant grants;
- queues, attempts, peers, payloads, metadata, tools and artifacts are bounded;
- cancellation is cooperative; the bounded blocking worker bridges it to the
  HTTP exchange, while streaming transports must check it between chunks;
- model bytes require exact size and SHA-256 before activation;
- `Unrestricted` removes voluntary AppCore headroom, not OS or hardware safety.

The beta.2 release defines streaming, but its built-in HTTP transport remains complete-response;
a deployment transport must implement native SSE explicitly. PDF/OCR,
automatic engine installation/process sandboxing, production Swarm integration
and declarative manifests remain outside this beta scope.

For complete API examples, hardware semantics, model limits, recipes,
benchmarks and the threat
model, use the crate-owned [guide.en.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/guide.en.md),
[basic.en.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/examples/basic.en.md), and
[intermediate.en.md](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/examples/intermediate.en.md).
The exact [hardware resource guide](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/resources.en.md)
records the platform matrix, dependency rationale, model-fit examples and
operational metrics.
The exact [performance report](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/benchmarks.en.md)
and [beta matrix](https://github.com/dnettoRaw/app-core-public/blob/beta/crates/appcore-ai/wiki/release-readiness.en.md)
are versioned with the crate.
