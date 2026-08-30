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

Canvas é um contrato de desenho semântico, não um buffer de pixels. Coordenadas
aceitam `pt`, `px`, `mm`, `cm`, `in`, `%`, `lu` lógico e valores
`norm`/`normalized` limitados a `0..=1`. Text, image, line, rect, circle,
ellipse, polygon, path e group permanecem nós tipados; paths preservam comandos
move, line, curve cúbica e close. Circle exige eixos resolvidos iguais. Safe
area, presets, layers/z-index, transforms e colisão são entradas explícitas e
ortogonais.

As cores permanecem independentes do formato como RGB, RGBA, Gray ou CMYK em
milionésimos. O YAML aceita nomes estáveis, hex, notação funcional inteira e
cores tipadas com tag explícita; fundos por fill, bordas por stroke e opacity
continuam separados. `MemoryResolver` e `FileResolver` com raiz canônica
implementam busca limitada de assets, templates e fontes.
`FontManager::register_from` registra uma fonte lógica exata sob o limite de
bytes do chamador e nunca varre as fontes do host.

A cascata completa é defaults → theme → template → style expandido de
component/nome/inline → regras condicionais de dados ordenadas → `SetStyle`
runtime transacional → `ExportStyleOverride`. Style runtime muda antes da
medição. A layer de export expõe somente fill, stroke, opacity e cor de texto,
portanto não invalida geometria resolvida. Layer, z-index e ordem da origem
ordenam pintura independentemente da colisão por geometria.

Metadados raster e SVG são resolvidos antes do export. `contain` e o ramo de
redução de `scale_down` preservam aspecto em microunidades fixed-point; fill,
none intrínseco, crop, cover focal e EXIF opcional geram retângulos imutáveis de
origem, destino e clip. Preflight calcula DPI raster efetivo após o transform.
SVG/HTML incorporam SVG; PDF/raster registram sua rasterização ainda não
suportada como perda explícita de fidelidade.

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

Todo formato de documento escreve em um writer do chamador e também oferece
bytes limitados em memória; CSV de dataset transmite linhas pelas mesmas duas
interfaces. DPI
se aplica somente a PNG/JPEG e qualidade somente a JPEG. PNG preserva
transparência, enquanto JPEG registra flattening de alpha de style ou imagem
antes do output strict. HTML fixo não anuncia capability semântica. PDF emite
metadados determinísticos de título, creator e producer; PDF editável embute
subsets exatos de glyphs e mapas Unicode. PDF Hybrid, links, bookmarks,
acessibilidade tagged, PDF/A, WebP, XLSX, ZPL e ESC/POS permanecem contratos
preparados explícitos.

A validação tem etapas explícitas de schema, dados tipados, layout resolvido e
preflight consciente do exporter. Warnings limitados são first-class; strict os
rejeita e truncamento do report falha fechado. Preflight detecta gaps de
binding, asset, glyph, colisão, overflow, DPI efetivo, vector/CMYK/alpha JPEG,
font editável e acessibilidade solicitada.

Fingerprints determinísticos enquadram versões de schema e engine,
template/dados/patches canônicos, digests dos assets referenciados e das fonts
registradas. `LayoutEngine::resolve_cached` resolve somente em miss do
`SceneCache` limitado, retorna cenas imutáveis compartilhadas para render-many
e rejeita versões antigas do engine.

Trabalho sobre input hostil tem limites explícitos. O binding compartilha um
único orçamento de elementos entre raízes, descendentes e expansão de repeats,
com cancelamento/progresso cooperativo nas fronteiras de elemento. O layout tem
um orçamento total de comparações espaciais além do reflow limitado. Leituras
de filesystem sob raiz canônica rejeitam traversal e links de escape, abrem sem
seguir symlink/reparse point final substituído, respeitam o limite de bytes e
revalidam o sandbox ao redor da leitura. O cancelamento de export ocorre antes
de output visível pelo chamador.

Os gates de confiabilidade incluem snapshots exatos do SVG visual e da mask de
colisão, properties de geometria fixed-point e fuzz targets separados para o
pipeline YAML/bind/layout limitado, Unicode arbitrário e texto grande demais,
assets raster corrompidos, tamanhos absurdos/overlaps/anchors circulares e
grafos de include malformados, circulares ou profundos demais. Input inválido
pode falhar com erro tipado, mas não pode causar panic, loop infinito ou
alocação sem limite explícito.

Debug permanece uma layer derivada e somente leitura. `DebugOverlay` fornece
grids limitados de 1/5/10/20 pontos, rulers, coordenadas, IDs, bounds distintos,
anchors, regions resolvidas, geometria safe/collision, exclusões e crosshairs
sem mudar layout ou ordem de pintura. Masks collision/layout/visual/combined
derivam retângulos ocupados e livres por view e exportam PNG, PDF, SVG ou JSON
estável occupied/free/collisions/overflow. `inspect` e `explain` preservam trace
estruturado de x/y/width/height de origem, anchors, region, medição, policy de
colisão, página/reflow e provenance.

O core determinístico não depende de IA. `appcore-filemaker-ai` é um bridge
opcional de 20 tools sobre `appcore-ai`; `appcore-filemaker-cli` é o adaptador
de processo limitado. Exemplos e evidências estão na branch `beta` do Runtime.

Export e preflight rejeitam independentemente cenas resolvidas públicas antigas
ou malformadas e aplicam budgets de páginas, elementos, paths, linhas, texto e
coordenadas antes de escrever. Overlay diagnóstico, mask de colisão/JSON e
regiões livres também consomem limites explícitos de comparações e geometria
retida. IDs validados preservam o invariante do construtor ao desserializar.
Exports controlados observam cancelamento e reportam progresso dentro dos loops
reais de elementos dos renderers, antes de escrever o output preparado ao
chamador.
O pipeline de fonts explícitas usa `harfrust`, mantido pelo projeto HarfBuzz,
para shaping e `skrifa`, do Google Fonts, para validação, métricas e outlines;
ele não descobre fonts do sistema operacional.
Uma font válida sem capital height em OS/2 usa ascent como policy explícita e
determinística de `CapHeight` do PDF; advances ausentes falham.

Os exemplos Rust executáveis mantêm o documento nos arquivos separados
[`basic.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/basic.yml)
e [`intermediate.yml`](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/intermediate.yml).
Os runners Rust carregam esses arquivos em vez de embutir o YAML do template.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/intermediate.pt.md).
O [plano de implementação M0-M12](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/implementation-milestones.pt.md)
registra API, módulos, aceitação, testes, benchmark/fuzz e riscos de cada
incremento; ele não autoriza publicação nem tags.
