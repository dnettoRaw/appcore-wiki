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

Containers de flow vertical e horizontal aceitam `start`, `center`, `end`,
`space_between`, `space_around` e `space_evenly`. Distribuição diferente de
start exige tamanho primário explícito, preferido ou derivado de aspect;
auto-medição ambígua e overflow falham antes da colisão.

`exclusions` nomeadas no nível superior definem retângulos relativos à página
que não são pintados e devem ficar dentro do trim box. Elas repetem dentro do
orçamento global de geometria e inicializam o índice espacial de cada página
física antes de posicionar elementos. Os campos opcionais `group` e
`collides_with` usam o mesmo contrato simétrico de colisão dos elementos,
enquanto a política push/error/next-page/shrink do candidato continua
responsável pelo reflow limitado. Inspeção, máscaras de colisão e consultas de
regiões livres mantêm a exclusão resolvida; exporters não recebem node para
pintá-la.

Páginas de documento podem declarar layers `master`, `first`, `continuation` e
`last`, cada uma dividida em bandas `background`, `header` e `footer` sem
colisão. Elementos master repetem em toda página física; uma layer de papel é
escolhida depois da paginação limitada do corpo; e o texto `{page}`/`{pages}`
só é resolvido quando o total final é conhecido. Componentes, estilos, binding,
patches, inspeção e todos os exporters da cena respeitam o mesmo contrato.
Elementos resolvidos mantêm um flag `collidable` para que overlays não criem
colisões falsas, consumam regiões livres ou alterem a paginação.

Streams `Dataset` reiniciáveis param na amostra limitada da coluna auto sem
varrer o restante. Tabelas resolvem larguras fixed, auto por amostra e flex
ponderada; paginam linhas fixas ou medidas por callback com capacidade correta
do header inicial/repetido; mantêm limites de grupo e estilos condicionais; e
emitem totais integer/decimal/currency verificados somente na página final.
Limites de linha, field, célula, expressão, amostra e página falham fechados.

O YAML estrito agora expõe esse contrato diretamente: um elemento
`type: table` deve declarar suas colunas e um `binding` para array. Agrupamento,
totais, estilos condicionais, repetição do header e tamanho de linha permanecem
tipados em `TableIr`; cada linha vinculada deve ser object. Limites específicos
do template para linhas, fields e células só podem restringir os limites de
recursos globais do compiler.

O layout agora converte cada página limitada da tabela em um
`ResolvedTableFragment` imutável numa página física da cena. Colunas exatas,
headers repetidos, retângulos de linha/célula, estilos de dados, continuidade de
grupo, totais e texto moldado são fixados antes do export. Continuações usam os
limites globais normais de páginas e colisão; exporters não medem nem repaginam.

PDF editável/flattened, SVG, PNG/JPEG e HTML semântico/fixo agora renderizam
esses fragments resolvidos diretamente. O uso de fontes no PDF inclui cada run
de célula, SVG e HTML incluem as fontes dos estilos de dados, e o raster contorna
os mesmos glyphs moldados. O preflight valida estrutura da tabela, limites das
células, diagnósticos de texto e requisitos de fontes incorporadas antes do
export.

Os outputs implementados são PDF editável/flattened, SVG, PNG, JPEG,
HTML semântico/fixo, CSV streaming e máscaras PNG/PDF/SVG/JSON. Modos e nodes
preparados falham explicitamente ou entram em `ExportLossReport`.

O core determinístico não depende de IA. `appcore-filemaker-ai` é um bridge
opcional de 20 tools sobre `appcore-ai`; `appcore-filemaker-cli` é o adaptador
de processo limitado. Exemplos e evidências estão na branch `beta` do Runtime.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/intermediate.pt.md).
