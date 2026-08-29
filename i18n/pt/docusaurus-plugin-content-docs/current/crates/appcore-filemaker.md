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

A política de colisão herda na ordem explícita documento → página → região →
grupo → elemento. O YAML aceita `collision: false`, e o reflow consulta o bound
medido selecionado: layout, visual ou intrínseco.

Transforms fixed-point aceitam translação, rotação em graus inteiros, escala,
flip/mirror e origins explícitas. Eles compõem através de grupos, e PDF, SVG,
PNG/JPEG e HTML consomem a mesma matriz resolvida.

Elementos de texto declaram layout por `text_options`. Overflow aceita `wrap`,
`shrink`, `ellipsis`, `clip`, `expand` e `error`, com `max_lines` limitado,
`min_font_size` absoluto e `line_height` fixed-point. Medição e expansão
ocorrem antes da colisão; clipping é geometria resolvida; SVG e HTML renderizam
os runs moldados/truncados. Escrita vertical e emoji colorido são perdas
explícitas do exporter até serem implementados.

Geometria declarativa também atravessa YAML e IR sem alteração. `constraints`
carrega mínimo, preferido, máximo e aspect ratio largura/altura fixed-point;
`align_x` e `align_y` escolhem início, centro ou fim no container ativo.
Anchors apontam para bordas de elementos anteriores ou guides nomeadas com
`guide:nome[+offset]`. Coordenadas, ranges e ratios contraditórios falham
explicitamente. Patches move/resize substituem a intenção posicional anterior.

Os outputs implementados são PDF editável/flattened, SVG, PNG, JPEG,
HTML semântico/fixo, CSV streaming e máscaras PNG/PDF/SVG/JSON. Modos e nodes
preparados falham explicitamente ou entram em `ExportLossReport`.

O core determinístico não depende de IA. `appcore-filemaker-ai` é um bridge
opcional de 20 tools sobre `appcore-ai`; `appcore-filemaker-cli` é o adaptador
de processo limitado. Exemplos e evidências estão na branch `beta` do Runtime.
