---
title: appcore-filemaker — 0.1 alpha
---

# appcore-filemaker

`appcore-filemaker 0.1.0-alpha.1` é o compilador determinístico oficial do
AppCore para documentos declarativos, canvases vetoriais e datasets. Está em
prévia no código-fonte e não foi publicado no crates.io; publicação é uma
decisão separada do mantenedor.

YAML estrito `filemaker: "1.0"`, dados tipados e patches atômicos compilam para
IR tipada. Fontes e assets explícitos são medidos antes do layout fixed-point,
colisão/reflow por geometria e construção da `ResolvedScene` imutável.
Inspeção, validação, preflight e exporter consomem a cena sem mudar geometria.

Os outputs implementados são PDF editável/flattened, SVG, PNG, JPEG,
HTML semântico/fixo, CSV streaming e máscaras PNG/PDF/SVG/JSON. Modos e nodes
preparados falham explicitamente ou entram em `ExportLossReport`.

O core determinístico não depende de IA. `appcore-filemaker-ai` é um bridge
opcional de 20 tools sobre `appcore-ai`; `appcore-filemaker-cli` é o adaptador
de processo limitado. Exemplos e evidências estão na branch `beta` do Runtime.
