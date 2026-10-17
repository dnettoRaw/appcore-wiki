---
title: appcore-filemaker — RC
---

# appcore-filemaker

:::info Release candidate
Candidata **`1.0.0-rc.2`**, a aguardar qualificação final e publicação no registry. Selecionar o pacote exato apenas após verificação.
:::

Se você está começando no formato, siga o
[guia YAML passo a passo](./appcore-filemaker-yaml.md). Ele parte do cabeçalho
mínimo e avança por dados, estilos, vetores, tabelas, papéis de página, imagens,
colisão, componentes e preflight estrito. O final traz a referência completa de
campos e identifica os nodes reservados que ainda não estão implementados.

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
A ordem explícita de fallback faz parte do fingerprint. SVG e HTML incorporam
as famílias realmente escolhidas nos glyph runs resolvidos, inclusive células
de tabela.

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
os runs moldados/truncados. `writing_mode: vertical` implementa colunas de cima
para baixo que avançam da direita para a esquerda em PDF, SVG, PNG/JPEG e HTML.
Emoji colorido continua uma perda explícita até ser implementado.

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
O planejamento de flow distribuído conta os filhos visíveis em duas passagens
limitadas, sem alocar uma lista temporária de referências e preservando o mesmo
espaçamento.
O fingerprint ordena referências emprestadas aos nomes de assets, evitando
strings clonadas durante a resolução determinística.

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
As camadas de página percorrem os elementos ativos de forma lazy por página
física, sem alocar uma lista temporária de referências.

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

PDF editável/flattened/híbrido, SVG, PNG/JPEG e HTML semântico/fixo agora renderizam
esses fragments resolvidos diretamente. O uso de fontes no PDF inclui cada run
de célula, SVG e HTML incluem as fontes dos estilos de dados, e o raster contorna
os mesmos glyphs moldados. O preflight valida estrutura da tabela, limites das
células, diagnósticos de texto e requisitos de fontes incorporadas antes do
export.
Elementos de texto podem compor declarativamente uma linha com estilo
compartilhado usando `text_segments`, bindings de string e comprimentos
explícitos em `gap_after`. Exija `overflow: error` e `max_lines: 1`; todas as
partes e gaps são medidas juntas antes do alinhamento e compartilhadas por PDF,
SVG, raster e HTML.
Runs PDF editáveis que usam uma face Standard 14 registrada são emitidos como
operações nativas de texto PDF. Larguras e kerning AFM continuam determinando
o layout; o leitor PDF aplica os avanços nativos da face durante a pintura.

Os outputs implementados são PDF editável/flattened/híbrido, SVG, PNG, JPEG,
HTML semântico/fixo, CSV streaming e máscaras PNG/PDF/SVG/JSON. Modos e nodes
preparados falham explicitamente ou entram em `ExportLossReport`.

Todo formato de documento escreve em um writer do chamador e também oferece
bytes limitados em memória; CSV de dataset transmite linhas pelas mesmas duas
interfaces. DPI
se aplica somente a PNG/JPEG e qualidade somente a JPEG. PNG preserva
transparência, enquanto JPEG registra flattening de alpha de style ou imagem
antes do output strict. HTML fixo não anuncia capability semântica. PDF emite
metadados determinísticos de título, creator e producer; PDF editável embute
subsets exatos de glyphs e mapas Unicode. PDF Hybrid pinta outlines
determinísticos e acrescenta texto Unicode invisível e subsetado nas coordenadas resolvidas dos
glyphs para busca, seleção e extração. Links, bookmarks, acessibilidade tagged,
PDF/A, WebP, XLSX, ZPL e ESC/POS permanecem contratos preparados explícitos.

A validação tem etapas explícitas de schema, dados tipados, layout resolvido e
preflight consciente do exporter. Warnings limitados são first-class; strict os
rejeita e truncamento do report falha fechado. Preflight detecta gaps de
binding, asset, glyph, colisão, overflow, DPI efetivo, vector/CMYK/alpha JPEG,
font incorporada para PDF editável/híbrido e acessibilidade solicitada.

Fingerprints determinísticos enquadram versões de schema e engine,
template/dados/patches canônicos, digests dos assets referenciados e das fonts
registradas. Campos JSON canônicos usam uma passagem de dimensionamento seguida
de hashing SHA-256 direto sob o budget agregado `max_output_bytes`, preservando
o framing V1 sem reter um buffer JSON completo.
`LayoutEngine::resolve_cached` resolve somente em miss do
`SceneCache` limitado, retorna cenas imutáveis compartilhadas para render-many
e rejeita versões antigas do engine.
O batch ordenado completo de patches tem limite global; remove/replace rejeitam
um subtree alvo que contenha qualquer descendente locked.

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
JSON, SVG e PDF da mask primeiro contam sob `max_output_bytes` sem reter o
output, rejeitam resultado excessivo antes de tocar no destino e então
serializam direto no writer do chamador. PDF emite objetos independentes, um
stream de comandos fixed-point de tamanho exato e seu xref sem buffer de página
ou arquivo completo. `collision_mask_json_4m` mede um output exato de 4.188.826
bytes; `collision_mask_pdf_100k` mede 100.000 retângulos e um PDF exato de
1.800.626 bytes com checkpoints RSS idle, pico e retido.

O macrobenchmark `a4_report_export_matrix` mede o pipeline A4 mantido de duas
páginas como uma operação limitada: decoding de YAML e dados tipados, patch em
runtime, medição/layout/colisão/reflow, preflight e nove outputs em streaming.
Ele cobre PDF editável, flattened e híbrido; SVG; HTML semântico e fixo; PNG;
JPEG com losses best-effort explícitos; e CSV do dataset. Três amostras isoladas
do commit limpo no Apple M1 mediram 70,56 ms p50, 71,34 ms p95, MAD de 0,22 ms
e 10,64 MiB de RSS pico.

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
Os dados tipados ficam em arquivos JSON correspondentes e separados. O runner
básico gera um SVG completo de uma página com texto associado, desenhos
semânticos, sparkline e tabela estilizada. O intermediário gera um relatório
confidencial de exatamente duas páginas, com numeração, watermark repetido,
gráficos vetoriais, tabela paginada, preflight estrito, PDF editável, HTML fixo
e previews SVG por página. Ambos registram explicitamente a Noto Sans sob OFL
incluída, sem depender de fontes do host. O código Rust não embute YAML nem JSON.

Documentação mantida pelo crate: [guia](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/guide.pt.md),
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/basic.pt.md) e
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/wiki/examples/intermediate.pt.md).

## EAN e QR Code nativos

Adições disponíveis em `0.1.0-beta.6`: `type: barcode` seleciona EAN-8 para
exatamente oito dígitos ASCII ou EAN-13 para treze, via `text` ou `binding`.
Ambos verificam o dígito fornecido, preservam zeros iniciais e rejeitam outros
comprimentos; sem completar ou corrigir. `barcode::Ean8`, `Ean13` e `ean_shape`
expõem a codificação. EAN-8 tem 67 módulos e sete módulos livres de cada lado;
EAN-13 tem 95, com onze à esquerda e sete à direita. Dígitos legíveis usam um
texto separado. Suplementos de dois/cinco dígitos, UPC e GTIN-14 não têm suporte
nesta API.

`type: qr` recebe texto UTF-8 literal ou vinculado. `qrcode::QrCode::encode`
produz Model 2 normal com correção média, byte mode e ECI UTF-8 explícito 26.
Escolhe a menor versão que comporta o conteúdo. Payloads devem ter 1–1024 bytes
UTF-8. Não acessa URLs nem interpreta o conteúdo. Entrada vazia/grande demais e
geometria insuficiente falham antes do export; erros e Debug omitem o payload.
Há quatro módulos livres em cada lado. O símbolo quadrado fica centralizado em
caixas retangulares, sem deformação. Layout contabiliza os comandos vetoriais
no limite cumulativo `max_path_commands`, incluindo símbolos repetidos.

Ambos viram paths vetoriais no layout, compartilhados por PDF, SVG, PNG/JPEG e
HTML fixo/semântico. Um `ResolvedElement` não preparado com kind `Qr` ou
`Barcode` ainda não tem exporter direto. Preserve fundo claro livre, tamanho de
impressão e DPI adequados; teste a impressora/scanner real. Codificação não é
certificação.

```yaml
filemaker: '1.0'
model: canvas
id: symbols
page: { width: 300pt, height: 230pt }
elements:
  - id: ean
    type: barcode
    x: 10pt
    y: 10pt
    width: 162pt
    height: 40pt
    text: '96385074'
    style: { fill: black }
  - id: qr
    type: qr
    x: 10pt
    y: 70pt
    width: 140pt
    height: 140pt
    text: 'https://example.org/local'
    style: { fill: black }
```

`tests/barcode_workflows.rs` verifica módulos reais de EAN-8/EAN-13 em PNG e
decodifica QR PNG/JPEG com decoder independente, incluindo Unicode e a fronteira
de 1024 bytes. Verifica entradas inválidas, rejeição de campos desconhecidos e
limites de paths. Mantém o fluxo multipágina de 80 linhas/240 itens em PDF/SVG/HTML.
Isso valida export genérico, não paridade com PDF comercial externo. YAML define
layout; adaptadores da aplicação fornecem dados tipados e chamadas de export.

Referências: [orientação GS1](https://www.gs1.org/standards/barcodes/10-steps-to-barcode-your-product/english)
e [API do encoder QR](https://docs.rs/qrcode/0.14.1/qrcode/struct.QrCode.html).

## Release publicada

`0.1.0-beta.6` — publicado no crates.io; versões anteriores permanecem imutáveis.

## Pacote publicado

[`appcore-filemaker 0.1.0-beta.6`](https://crates.io/crates/appcore-filemaker/0.1.0-beta.6) · [docs.rs](https://docs.rs/appcore-filemaker/0.1.0-beta.6) · [source](https://github.com/dnettoRaw/app-core-public/tree/beta/crates/appcore-filemaker).

## Prerelease independente — 2026-10-14

`0.1.0-beta.7`: alterações próprias.

[crates.io](https://crates.io/crates/appcore-filemaker/0.1.0-beta.7) · [docs.rs](https://docs.rs/appcore-filemaker/0.1.0-beta.7)

O frontend YAML substitui o parser sem manutenção por parsing em Rust seguro (`serde-saphyr`). Os modelos de fonte/fixtures YAML V1 e os booleanos YAML 1.2 são preservados. Campos desconhecidos, aliases recursivos e múltiplos documentos são rejeitados; os erros omitem trechos da fonte. O parser limita profundidade a 64, eventos a 1.000.000, aliases/âncoras a 50.000 e texto escalar agregado a 64 MiB, além dos limites existentes de entrada/schema. Nenhum fallback para o parser antigo é distribuído.

## Auditoria de conteúdo variável (2026-10-17)

Auditoria do baseline publicado (as falhas abaixo descrevem o pacote auditado): medição, expand, fluxo,
âncoras, agrupamento, audit/preflight e overlays já existem. Contentores com
altura intrínseca e corpo de tabela distinto na última página ainda não existem.
Expand com max_lines pode truncar sem diagnóstico; next_page pode reiniciar
em y=0 apesar das margens; auditoria não aplica consistentemente as exceções
de grupos de colisão. Zero perdas de exportação não prova layout seguro.
Corrigir esses casos antes de recomendar aceitação estrita. A primeira auditoria
executou 55 testes existentes e renderizou controles de 1/2/5/20 páginas sem
reordenação; isto não qualifica todo o corpus comercial. Crescimento opt-in e
convergência limitada da última página exigem contratos/migração explícitos,
preservando a semântica V1 publicada.


A 1.0.0-rc.2 já diagnostica expansão limitada e mantém o aviso nos fragmentos, inclui padding dos blocos, respeita a área útil/região na continuação com transformações do pai e partilha filtros de grupos/ignore/overlay com a auditoria. Campos públicos, YAML V1, limites explícitos e bandas de página são preservados. Contentores intrínsecos do corpo têm agora a API opt-in abaixo; os corpos adaptativos de tabela têm agora um plano opt-in separado; estas correções ainda não foram publicadas.

## Altura intrínseca (opt-in, 1.0.0-rc.2)

Usa `LayoutEngine::resolve_intrinsic(&document)` em vez de `resolve` para
medir os elementos com `height: auto` explícito no YAML. A chamada `resolve`,
o parser V1, os literais das estruturas públicas e as políticas de overflow
com altura fixa conservam o contrato. Não há dependências novas nem medição
manual no consumidor.

O texto usa o shaping e a medição existentes, com a fonte registada, estilo,
largura, padding e entrelinha efetivos. Contentores horizontais usam a maior
altura; os verticais somam alturas e espaçamentos. Define
`constraints: {min_height: 14mm}` para preservar o desenho curto. Fluxos e
âncoras recebem a caixa medida antes da resolução de colisões. O IR de entrada
não é alterado. Conteúdo acima de `max_height` produz erro com o ID.

Esta primeira opção suporta larguras definidas e fluxos do corpo distribuídos
no início. Texto automático aceita `wrap`, `expand` ou `error`, horizontal e
sem `max_lines`. Para `clip`, `ellipsis` ou `shrink`, usa altura fixa explícita.
Contentores automáticos são indivisíveis e devem caber numa região útil de
uma página. Os filhos não podem ter x/y, âncoras, região, transformações,
alinhamento geométrico diferente de início, keep-with-next nem alturas ou
restrições percentuais de altura. Texto filho com expansão deve usar altura
automática. Contentores absolutos/distribuídos, escrita vertical, bandas de
página automáticas, aspect ratio/preferred height no elemento automático e
padding vertical percentual produzem erro explícito. Assim não se estimam
silenciosamente dependências circulares.

A passagem verifica cancelamento, limites de elementos/texto e profundidade
máxima de 64 antes de clonar o documento ligado aos dados. A medição verifica
cancelamento por elemento; shaping de um elemento não é preemptivo. Há custo
adicional de cópia e medição, sem alegação de melhoria de desempenho ou RAM.
Executa preflight de layout na cena final, incluindo elementos fixos e overlays.
Não reutilizes chaves de cache do layout convencional para esta opção.

Executa `cargo run -p appcore-filemaker --example intrinsic_height --locked`.
`examples/intrinsic-height.yml` usa os JSON curto/longo separados, duas colunas,
texto alinhado à direita e âncoras para deslocar título e corpo. Os resultados
ficam em `target/filemaker-examples/`. O Rust não substitui coordenadas YAML.
O exemplo exige diagnósticos de layout válidos antes de exportar PDF.

Migração: opta pela nova chamada e declara alturas automáticas/mínimas no YAML.
Rollback: conserva o desenho original e usa `resolve`. A API Rust é aditiva,
sem outro parser ou versão YAML. Reservas adaptativas de primeira/páginas
intermédias/última de tabela usam agora o plano adaptativo separado; fluxos globais arbitrários ficam fora desse contrato.

Nas raízes que participam na medição intrínseca, os contentores são estruturais:
as políticas de colisão dos descendentes ignoram explicitamente os IDs dos
ancestrais. Colisões entre irmãos e com elementos externos continuam ativas.
A resolução convencional e as raízes sem altura automática mantêm as políticas.

A falha anterior de extração de ligaturas está corrigida na exportador 1.0.0-rc.2, com clusters completos e `/ActualText` contextual. Continua a conferir extração e renderização separadamente.

## Paginação adaptativa de tabela (opt-in, 1.0.0-rc.2)

`AdaptiveLayoutPlan::parse_yaml` lê um desenho YAML separado e estrito com
`filemaker_layout: '1.0'`. Depois do compile/bind V1 existente, chama
`LayoutEngine::resolve_adaptive(&document, &plan)`. A API é aditiva: preserva
literais das estruturas públicas, parser V1, `resolve` e `resolve_intrinsic`.
Não acrescenta dependências, formatos persistentes nem regras comerciais.

O plano seleciona uma tabela raiz, corpos verticais `first`, `intermediate`,
`last` e `single`, um bloco raiz final `closing`, o espaçamento e a política
obrigatória `oversized_group: error` ou `split_rows`. Offsets e alturas são
relativos à caixa completa da tabela, com largura constante. Os quatro corpos
devem caber nessa caixa; a caixa deve caber na região útil da página.

Os corpos declarados são ANTES da reserva do fecho. A altura visível do fecho
usa a medição intrínseca e as restrições existentes. Altura mais espaçamento
são subtraídos uma única vez de `single` ou `last`. O paginador existente
subtrai depois o cabeçalho da tabela uma única vez. Fecho oculto não reserva
altura nem espaçamento. As bandas decorativas mantêm a semântica V1 e não
criam reservas implícitas.

O grupo pendente existente permite reconhecer o grupo final. Só a sua última
linha transporta a diferença entre capacidade normal e final. Quando a linha
ou o grupo mudam de página, a reserva e a medição sensível à página são
recalculadas no destino. O fragmento final é deslocado para o corpo last/single;
as âncoras existentes posicionam o fecho depois do seu fundo. Para este problema
restrito de tabela vertical não é preciso estimar o número de páginas nem
iterar um ponto fixo global. Amostragem de colunas e medição de grupos ainda
podem visitar linhas várias vezes; não há promessa de uma única leitura.

Chaves contíguas iguais em `keep_together_by` permanecem juntas quando grupo e
reserva final cabem numa página de destino. `split_rows` divide entre linhas
quando esse requisito conjunto não cabe; `error` rejeita-o. Uma linha
indivisível que não caiba com a reserva falha nas duas políticas. Se um grupo
deixar a primeira página completamente vazia, há erro explícito, sem devolver
página vazia nem reclassificar silenciosamente uma continuação. Um dataset
vazio pode gerar cabeçalho e fecho, mas o cabeçalho deve caber.

Limites desta opção: uma tabela visível raiz que começa na página física zero;
um único bloco final do corpo ancorado por `top: table-id.bottom+gap`; essas
raízes não podem usar transformações, regiões ou keep-with-next. O fecho pode
ser texto ou contentor de fluxo automático. Os descendentes devem caber na
caixa medida e na página final da tabela. Colisão incompatível ou crescimento
de texto fixo produz erro sem cena parcial. Não combinar `table.page_bodies`,
`reserve_after` condicional ou `total_fields` interno com este dono da reserva.
Totais podem ser dados ligados no bloco de fecho. Várias tabelas, larguras
finais diferentes e fluxos globais dependentes da página exigem outro contrato
explícito, sem inferência.

Continuam ativos os limites de bytes, profundidade, elementos, linhas, páginas
e trabalho de colisão. O cancelamento é verificado antes do planeamento, na
visita das linhas, medição e avaliação de reservas; um shaping individual não
é preemptivo. O índice espacial é o mesmo, sem alegação de ganho de tempo ou
RAM. Valida layout e exportação separadamente: sucesso ou zero perdas declaradas
não provam geometria nem fidelidade da camada textual. A falha anterior de extração de ligaturas está corrigida na exportador 1.0.0-rc.2, com clusters completos e `/ActualText` contextual. Continua a conferir extração e renderização separadamente.

Executa `cargo run -p appcore-filemaker --example adaptive_pagination --locked`.
`examples/adaptive-pagination.yml`, `adaptive-pagination-plan.yml` e JSON
tipados separados geram exemplos de 1/2/5/20 páginas em `target/filemaker-examples/`.
O exemplo exige auditoria de layout e preflight antes de escrever cada PDF.
A regressão de oito linhas passa de três páginas para duas, com uma única
reserva de fecho e índices de origem ordenados e únicos. O consumidor não mede
texto nem substitui coordenadas em strings YAML no Rust.

Migração: guarda o desenho original, move o desenho do corpo para o plano,
remove reservas V1/por linha concorrentes, declara a âncora do fecho e seleciona
a nova chamada. Rollback restaura o desenho e a chamada anteriores; dados e
formatos persistidos mantêm-se. Incluído em `1.0.0-rc.2`;
a aplicação externa não foi migrada.

`first_after: {element: title, gap: 8pt}` permite iniciar `first` e `single`
abaixo de uma caixa de layout já medida na página física zero. Conserva os
fundos declarados e nunca sobe o início acima do offset original. Liga assim
o cabeçalho automático de duas colunas e o título à região da tabela, sem
aritmética de coordenadas no consumidor. A caixa completa da tabela pode
sobrepor essas caixas anteriores, embora o corpo útil selecionado não o faça:
declara os IDs em `collision.ignore` local, como em `examples/adaptive-header.yml`.
Não é preciso desativar colisões globalmente. Alvo ainda não resolvido, posterior,
noutra página ou corpo inicial esgotado produz erro explícito. Um dataset não
vazio deve colocar linhas na primeira página; um adiamento inicial que deixe
apenas títulos é rejeitado para não devolver um título isolado.

Executa `cargo run -p appcore-filemaker --example adaptive_header --locked`
para os cabeçalhos curto/longo. O mesmo YAML e plano usam JSON sintéticos
separados, com auditoria de layout e preflight obrigatórios. Os exemplos de
paginação e cabeçalho geram juntos seis documentos PDF para inspeção visual.

## Evidência limitada de paginação (adição 1.0.0-rc.2)

Usa `LayoutEngine::diagnose_adaptive(&document, &plan, max_decisions)` no lugar
de `resolve_adaptive` quando precisas de uma explicação. `AdaptiveLayoutReport`
expõe `outcome()`, `decisions()` e `into_outcome()`. Consulta ou guarda os registos
antes de propagar o resultado: a evidência anterior permanece disponível em caso
de erro. Cada chamada tem registos independentes. As APIs e os literais públicos
existentes mantêm-se; a resolução normal não cria um coletor.

Cada `PaginationDecision` contém o ID da tabela, página física candidata e
ordinais das linhas de origem (base zero, intervalo inclusivo), regra real e
alturas numéricas. `capacity` desconta o cabeçalho da tabela uma vez;
`used_height` inclui linhas e reservas anteriores;
`available_height = capacity - used_height`;
`required_height = group_height + reserved_height`. `final_reservation` já está
incluída em `reserved_height`: não a somar outra vez. Combina fecho e espaçamento
com a diferença entre alturas do corpo normal e final, podendo exceder a altura
do fecho isoladamente.

As regras são `fit`, `move_group`, `split_rows`, `move_row`, `skip_first_page`
e `reject`. Um avanço descreve o candidato na origem; o `fit` posterior usa
medição e reserva do destino. A decisão sobre grupo excessivo avalia uma página
de continuação vazia, mesmo que essa página nunca seja emitida. Os registos
mostram execução, não são uma lista de páginas emitidas nem garantia de sucesso.
Validação anterior à paginação pode falhar sem registos; uma validação posterior
pode conservar decisões `fit` sem devolver cena. Dataset vazio não produz
decisões de linhas. O enum de regras é não exaustivo.

O limite explícito tem de estar entre um e `ResourceLimits.max_elements`.
Esgotá-lo devolve `LimitExceeded` e conserva o prefixo, sem truncar silenciosamente
nem devolver cena parcial. Não guarda texto, payloads nem valores de agrupamento,
apenas IDs, ordinais e geometria. O coletor opcional usa secções curtas de mutex,
preserva as características Send/Sync do motor e acrescenta custo de alocação e
serialização. Cancelamento e limites existentes de páginas, linhas e medição
continuam ativos.

`cargo run -p appcore-filemaker --example adaptive_pagination --locked` grava
`*-pagination.json`, `*-debug.json` e `*-mask-*.svg` por página, junto dos exemplos
de 1/2/5/20 páginas. Reutiliza `DebugOverlay::build_bounded` (área útil, regiões,
caixas de layout/intrínsecas/visuais e âncoras) e o exportador SVG de
`CollisionMask`. A máscara descreve ocupação geométrica; `audit_layout` aplica
as políticas efetivas de sobreposição. `SceneInspector::explain_layout` explica
a geometria final; `audit_layout` identifica colisões e cortes com geometria.
Continua a usar preflight estrito e revisão do PDF renderizado: zero perdas do
exportador não prova um layout seguro. Rótulos do overlay podem conter expressões
da fonte; revê-os antes de partilhar externamente.

Rollback: volta a `resolve_adaptive` e deixa de guardar estes outputs.
Sem alterações ao YAML, persistência, dependências, índice espacial ou consumidor.

`header_height` mostra a reserva de cabeçalho aplicada; `body_height = capacity + header_height` mostra o corpo normal antes desse desconto.

## Corpus sintético misto e gate de adoção pelo consumidor


Executa `cargo run -p appcore-filemaker --example variable_corpus --locked`.
Um desenho YAML e um plano adaptativo separado recebem quatro datasets JSON
tipados e sintéticos. Os outputs `target/filemaker-examples/variable-corpus-*`
incluem PDF, cena, preflight estrito, decisões, overlay e máscaras SVG.
Este incremento também corrige a precedência de pintura das bandas no motor existente. Sem novas dependências, API pública, campos serializados ou versão publicada.

| Páginas | Grupos | Linhas de origem |
|---|---|---|
| 1 | 3 | 9 |
| 2 | 12 | 36 |
| 5 | 40 | 120 |
| 20 | 190 | 570 |

Cada grupo contém artigo, descrição variável e comentário com remise detalhada.
As três linhas partilham `keep_together_by`; `oversized_group: error` rejeita
explicitamente uma descrição que exceda uma página. O teste verifica texto lógico
no shaping e altura medida das células, além das strings de origem.
O cabeçalho automático em duas colunas, o título dependente e o primeiro corpo
partilham a medição nativa. Três taxas de TVA, valores anteriores, remises,
totais líquidos/fiscais/finais, condições, assinatura e EAN-13 são dados fornecidos
pelo consumidor sintético. O FileMaker não calcula impostos nem valida regras
comerciais. Os totais das fixtures são coerentes, mas o corpus não é certificação fiscal.

O primeiro valor anterior tem uma linha sobre a célula, com overlay local explícito.
A marca de água em todas as páginas e o carimbo da primeira usam bandas existentes:
essas bandas já têm contrato de pintura sem colisão e rejeitam um campo `collision`
explícito. A deteção de colisão do corpo permanece ativa. Âncoras esparsas devem
ser omitidas ou null quando ausentes, não strings vazias repetidas.
As coordenadas X do corpo são relativas à origem da região útil; uma regressão
confirma que o risco fica dentro da célula pretendida depois desse deslocamento.
Foi uma correção de configuração da fixture, não uma falha do motor ou do shaping.

Os testes verificam ordem sem perda/duplicação, texto integral nas células, grupos
intactos, número de páginas, geometria do risco e descendentes do fecho apenas na
última página, incluindo código e assinatura. Executam `audit_layout` e preflight
estritos. As páginas também devem ser renderizadas e revistas: zero perdas de
exportação não aprova o layout. A falha anterior de extração de ligaturas está corrigida na exportador 1.0.0-rc.2, com clusters completos e `/ActualText` contextual. Continua a conferir extração e renderização separadamente. Máscaras SVG mostram ocupação geométrica;
`audit_layout` aplica as políticas de sobreposição intencional.


A adoção exige uma nova RC exata publicada no registry; não inclui patch local nem alteração do consumidor externo.

Reproduz a verificação após executar o exemplo: `python3 crates/appcore-filemaker/wiki/audit/verify-variable-corpus.py`. Exige Poppler, confere IDs ordenados de artigos/descrições/comentários, linhas de totais fornecidos, os 95 módulos EAN-13 renderizados e zonas de silêncio, e renderiza as 28 páginas. Não substitui revisão visual nem certificação de scanner.

A marca de água pertence a `page.master.background`. `z_index` ordena a pintura dentro de uma camada; um valor negativo em `header` não coloca a marca atrás dos glifos do corpo. A regressão falhou primeiro com a banda de cabeçalho e verifica agora a camada de fundo e a ordem de pintura. O preflight estrito aprovava a configuração que tapava o texto.

O corpus também revelou uma falha do motor: a ordenação textual colocava a camada vazia do corpo antes de `!page-background`, e nomes Unicode podiam ficar depois da banda de primeiro plano. A correção compatível dá precedência explícita às bandas: fundo, corpo, cabeçalhos/rodapés. Os nomes das camadas do corpo conservam a ordem textual, seguida de z-index e sequência. Os testes cobrem camadas vazias/personalizadas/Unicode, valores extremos de z-index e pixels raster reais. Sem substituir o índice espacial ou criar API.

## Texto Unicode integral no PDF (correção 1.0.0-rc.2)

A exportação Editable e Hybrid associa agora cada cluster de um glifo à sua
sequência UTF-8 lógica completa em `ToUnicode`, em vez de só ao primeiro carácter.
O writer PDF existente emite os destinos UTF-16, incluindo pares substitutos.
Os limites dos clusters seguem os offsets lógicos ordenados em bytes, independentemente
da ordem visual RTL. Fronteiras UTF-8 inválidas, offsets finais ou fora do texto
devolvem `ExportUnsupported`, sem omitir silenciosamente o mapeamento.

Um glifo pode corresponder a `fi` e ao carácter literal `ﬁ`, ou a texto composto
e decomposto. Um mapa por fonte não representa todas essas ocorrências.
Runs ambíguos ou com vários glifos por cluster conservam o texto lógico original
em spans PDF `/ActualText`. Não se associa o texto completo de um cluster a cada
um dos seus glifos. Não é aplicada normalização Unicode.
Os leitores que extraem esses casos contextuais devem respeitar `/ActualText`.

Mantêm-se PDF 1.7, fontes, IDs, avanços e geometria. Sem novas dependências,
campos públicos, opções YAML ou APIs. As fontes Standard 14 WinAnsi conservam
o percurso existente. Flattened continua a produzir contornos sem texto pesquisável.
A correção atua no mapeamento da exportação, mantendo layout, shaping, políticas
de corte e posicionamento bidi. Extratores RTL podem devolver ordem visual com
controlos de direção; o exemplo verifica a sequência integral não acentuada nas
formas lógica ou visual.

As strings dos CMaps partilham o orçamento explícito
`ResourceLimits.max_output_bytes`, verificado antes de alocar. O índice temporário
de clusters é linear no número limitado de glifos; ordenação e pesquisa acrescentam
trabalho sem repetir shaping. Continuam ativos os limites de cena, texto e output.
Não há promessa de RSS constante ou ganho de velocidade.

Executa `cargo run -p appcore-filemaker --example pdf_unicode --locked` para criar
amostras Editable, Hybrid e Flattened. Incluem `fi/fl/ffi/ffl`, palavras correntes,
ligaturas literais, acentos compostos/decompostos, um cluster isolado com vários
glifos e recurso de fonte próprio, e clusters árabes.

Depois executa
`python3 crates/appcore-filemaker/wiki/audit/verify-pdf-unicode.py`.
Exige Poppler, renderiza cada modo, confere os escalares latinos exatos sem
normalização NFC/NFKC, verifica o exemplo RTL e a ausência de texto no Flattened,
e compara os pixels Hybrid/Flattened. Auditoria, preflight, extração e revisão
visual continuam a ser verificações distintas.

O verificador do corpus misto confere agora todo o texto dos elementos e das
células, além dos IDs e totais. PDFs existentes precisam de nova exportação.
O consumidor fixado no registry só recebe esta correção numa nova RC exata
publicada e qualificada. Sem publicação de pacotes, deploy da wiki ou migração
do consumidor externo. O rollback seleciona a release qualificada anterior do
exportador explicitamente.
