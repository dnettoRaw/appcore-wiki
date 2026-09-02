---
title: appcore-filemaker — guia YAML passo a passo
---

# Criando um documento YAML passo a passo

Este guia ensina a escrever um template `filemaker: "1.0"` do zero. O YAML é
estrito: um nome de campo desconhecido, uma unidade ausente ou uma combinação
inválida produz erro. Isso evita que um erro de digitação gere um documento
diferente do esperado.

O template descreve o documento. Os dados ficam em um JSON separado, a fonte é
registrada explicitamente e o formato final é escolhido no comando de export.

## 1. Crie o menor documento possível

Salve como `report.yml`:

```yaml
filemaker: "1.0"
model: document
id: my-first-report
page:
  preset: A4
elements:
  - id: title
    type: text
    text: "Hello, FileMaker"
    x: 20mm
    y: 20mm
    width: 170mm
    height: 12mm
    style:
      font: NotoSans
      font_size: 22pt
      color: "#17324d"
```

- `filemaker` seleciona o contrato. Em V1, use exatamente `"1.0"`.
- `model` escolhe `document`, `canvas` ou `dataset`.
- `id` é o identificador estável do template.
- `page` define a área física.
- `elements` contém os itens visuais em ordem estável.
- Cada texto precisa de uma fonte registrada; fontes do sistema não são
  descobertas automaticamente.

Valide antes de renderizar:

```bash
appcore-filemaker check report.yml --json
appcore-filemaker validate report.yml \
  --font NotoSans=./NotoSans-Regular.ttf \
  --json
appcore-filemaker render report.yml \
  --font NotoSans=./NotoSans-Regular.ttf \
  --format pdf \
  --output report.pdf
```

`check` valida o schema. `validate` também resolve fonte e layout. `render`
gera o artefato. Para PDF de produção, execute ainda `preflight --strict`.

## 2. Escolha página, orientação e áreas de segurança

```yaml
page:
  preset: A4
  orientation: portrait
  margin: { top: 12mm, right: 12mm, bottom: 15mm, left: 12mm }
  safe: { top: 8mm, right: 8mm, bottom: 8mm, left: 8mm }
  bleed: { top: 3mm, right: 3mm, bottom: 3mm, left: 3mm }
  crop_marks: false
```

- `preset` usa um tamanho conhecido. Há séries `A0..A10`, `B0..B10`,
  `C0..C10`, tamanhos norte-americanos, tela, foto, envelope, etiqueta,
  térmico e social.
- `orientation` aceita `portrait` ou `landscape`.
- `margin` reserva a margem de layout.
- `safe` marca a área segura dentro da página.
- `bleed` declara sangria fora do corte.
- `crop_marks` solicita marcas de corte quando o exporter as suporta.
- Em vez de `preset`, use `width` e `height`; não use os dois modos juntos.

Exemplo de canvas sem preset:

```yaml
page:
  width: 1920px
  height: 1080px
```

## 3. Entenda as unidades

Todo comprimento precisa de unidade.

| Forma | Uso |
|---|---|
| `12pt` | tipografia e medidas PostScript |
| `20px` | canvas e telas; 96 DPI lógico |
| `15mm`, `2.5cm`, `1in` | medidas físicas |
| `50%` | metade da dimensão do container |
| `0.5norm` | forma normalizada de `50%` |
| `12lu` | unidade lógica fornecida pelo contexto |
| `auto` | medição automática apenas nos campos que a aceitam |

Não escreva `x: 20`. Escreva `x: 20mm`, `20pt` ou outra unidade explícita.

## 4. Crie tokens, tema e estilos reutilizáveis

```yaml
themes:
  base:
    tokens:
      ink: "#17324d"
      accent: "#2e75b6"
      pale: "#eef4f8"
    style:
      color: "$ink"
  board:
    extends: base
theme: board

styles:
  title:
    font: NotoSans
    font_size: 24pt
    color: "$ink"
  card:
    fill: "$pale"
    stroke: "$accent"
    stroke_width: 1pt
```

- `themes` declara temas nomeados.
- `extends` herda outro tema e não pode formar ciclos.
- `tokens` guarda cores ou outros valores usados como `$nome`.
- `theme` ativa exatamente um tema.
- `style` no topo aplica um estilo a todo o template.
- `styles` cria estilos nomeados.
- `styles: [title, card]` num elemento aplica estilos na ordem declarada.
- `style` no elemento é a última camada estática daquele elemento.

Campos de style:

| Campo | Para que serve |
|---|---|
| `fill` | preenchimento |
| `stroke` | contorno |
| `stroke_width` | espessura do contorno |
| `opacity` | opacidade de `0` a `1000000` |
| `font` | nome lógico da fonte registrada |
| `font_size` | tamanho da fonte |
| `color` | cor do texto |

Cores aceitam nomes estáveis, hexadecimal, `rgb(...)`, `rgba(...)`,
`gray(...)`, `cmyk(...)` em milionésimos e valores tipados. Opacidade
`240000` significa 24%.

## 5. Adicione texto com comportamento de overflow

```yaml
- id: summary
  type: text
  text: "A bounded operational summary"
  x: 20mm
  y: 40mm
  width: 100mm
  height: 18mm
  styles: [title]
  text_options:
    overflow: shrink
    max_lines: 2
    min_font_size: 10pt
    line_height: 1200000
    writing_mode: horizontal
```

`overflow` aceita:

- `wrap`: quebra linhas;
- `shrink`: reduz até `min_font_size`;
- `ellipsis`: termina com reticências;
- `clip`: recorta e registra diagnóstico;
- `expand`: aumenta a caixa medida;
- `error`: falha se não couber.

`writing_mode` aceita `horizontal` (padrão) ou `vertical`. No modo vertical, o
texto quebra pelo limite de altura, cada coluna é moldada de cima para baixo e
as colunas avançam da direita para a esquerda. PDF, SVG, PNG/JPEG e HTML usam
as mesmas colunas e runs resolvidos, sem reflow no exporter; PDF e raster usam
os avanços dos glyphs diretamente.

## 6. Desenhe formas vetoriais

```yaml
- { id: surface, type: rect, x: 20mm, y: 70mm, width: 70mm, height: 35mm, style: { fill: "#eef4f8" } }
- { id: status, type: circle, x: 25mm, y: 76mm, width: 20mm, height: 20mm, style: { fill: "#2a9d8f" } }
- { id: divider, type: line, x: 20mm, y: 112mm, width: 170mm, height: 0pt, style: { stroke: "#2e75b6", stroke_width: 1pt } }
```

Tipos implementados:

| `type` | Uso específico |
|---|---|
| `text` | texto medido com fonte explícita |
| `image` | imagem resolvida por asset explícito |
| `line` | linha simples ou comandos de path |
| `rect` | retângulo |
| `circle` | círculo; largura e altura devem ser iguais |
| `ellipse` | elipse |
| `polygon` | polígono fechado sem curvas |
| `path` | path com linhas e curvas Bézier cúbicas |
| `group` | container de filhos |
| `table` | tabela tipada e paginável |

`chart`, `qr` e `barcode` são nomes reservados, não capacidades V1
implementadas. Para gráficos atuais, componha `rect`, `line`, `path` e `text`.

Um path semântico:

```yaml
- id: trend
  type: path
  x: 105mm
  y: 70mm
  width: 80mm
  height: 35mm
  style: { stroke: "#f4a261", stroke_width: 2pt }
  path:
    - { command: move, x: 0%, y: 80% }
    - { command: line, x: 30%, y: 55% }
    - { command: curve, x1: 45%, y1: 70%, x2: 70%, y2: 10%, x: 100%, y: 20% }
```

Comandos aceitos: `move`, `line`, `curve` e `close`. `curve` usa `x1`, `y1`,
`x2`, `y2`, `x`, `y`.

## 7. Separe os dados do layout

Declare o schema no YAML:

```yaml
data_schema:
  report_title: { type: string }
  requests: { type: integer }
  target_met: { type: boolean }
  rows: { type: array }
  above_target:
    type: boolean
    computed: 'data.target_met == true'
```

Tipos: `string`, `integer`, `decimal`, `boolean`, `date`, `date_time`,
`duration`, `currency`, `array`, `object` e `null`. Use `nullable: true` quando
o campo aceitar nulo. `computed` é uma expressão determinística, sem rede ou IO.

No elemento, associe o valor:

```yaml
- id: bound-title
  type: text
  binding: data.report_title
  x: 20mm
  y: 20mm
  width: 170mm
  height: 12mm
  styles: [title]
```

Controle visibilidade e repetição:

```yaml
- id: success-badge
  type: rect
  when: data.target_met
  x: 160mm
  y: 20mm
  width: 30mm
  height: 10mm

- id: repeated-row
  type: group
  repeat: data.rows
  children: []
```

- `binding` fornece o conteúdo principal do elemento.
- `when` pinta o elemento somente quando a expressão for verdadeira.
- `repeat` expande o elemento uma vez por item de um array, sob limites.
- `style_rules` aplica estilos condicionais em ordem.

```yaml
style_rules:
  - when: 'data.target_met == true'
    style: { fill: "#e4f4ec", color: "#1f7a4d" }
```

## 8. Organize elementos em grupos e flows

```yaml
- id: kpis
  type: group
  x: 20mm
  y: 55mm
  width: 170mm
  height: 35mm
  layout: flow_horizontal
  distribute: space_between
  gap: 5mm
  children:
    - { id: kpi-a, type: rect, width: 50mm, height: 30mm }
    - { id: kpi-b, type: rect, width: 50mm, height: 30mm }
    - { id: kpi-c, type: rect, width: 50mm, height: 30mm }
```

`layout` aceita `absolute`, `flow_vertical` ou `flow_horizontal`.
`distribute` aceita `start`, `center`, `end`, `space_between`, `space_around`
ou `space_evenly`. Distribuição diferente de `start` exige tamanhos explícitos
ou preferidos nos filhos. `gap` é a distância normal entre filhos.

## 9. Crie uma tabela paginável

```yaml
- id: results
  type: table
  binding: data.rows
  x: 15mm
  y: 120mm
  width: 180mm
  height: 150mm
  style: { font: NotoSans, font_size: 8pt, color: "#17324d" }
  table:
    columns:
      - { field: name, header: Name, width: { mode: flex, value: 2 } }
      - { field: amount, header: Amount, width: { mode: fixed, value: 30mm } }
      - { field: status, header: Status, width: { mode: auto } }
    repeat_header: true
    group_by: region
    total_fields: [amount]
    conditional_styles:
      - { when: 'data.status == "Watch"', style: { fill: "#fff2e8", color: "#8f4b17" } }
    auto_sample_rows: 8
    max_rows: 100
    max_row_fields: 12
    max_cell_bytes: 256
    header_height: 8mm
    row_height: 7mm
```

- `columns` define ordem, field, header e largura.
- Largura `fixed` é exata, `flex` divide o espaço restante e `auto` mede uma
  amostra limitada.
- `repeat_header` repete o cabeçalho após paginação.
- `group_by` preserva a chave de agrupamento.
- `total_fields` soma campos numéricos exatos somente na última página.
- `conditional_styles` estiliza uma linha usando seu objeto como `data`.
- `auto_sample_rows` limita a amostra de colunas `auto`.
- `max_rows`, `max_row_fields` e `max_cell_bytes` só podem apertar os limites
  globais, nunca aumentá-los.
- `row_height: auto` mede cada linha; uma medida explícita é mais previsível.

## 10. Adicione cabeçalho, rodapé, watermark e numeração

```yaml
page:
  preset: A4
  master:
    header:
      - { id: top-rail, type: rect, x: 0mm, y: 0mm, width: 100%, height: 7mm, style: { fill: "#17324d" }, locked: true }
    footer:
      - { id: page-number, type: text, text: "Page {page} of {pages}", x: 160mm, y: 285mm, width: 35mm, height: 5mm, style: { font: NotoSans, font_size: 8pt }, locked: true }
  first:
    footer:
      - id: confidential
        type: text
        text: "CONFIDENTIAL"
        x: 5mm
        y: 113mm
        width: 200mm
        height: 42mm
        style: { font: NotoSans, font_size: 78pt, color: "#8da3b5", opacity: 240000 }
        transform: { rotate: -32, origin_x: 50%, origin_y: 50% }
        locked: true
```

Cada papel (`master`, `first`, `continuation`, `last`) aceita `background`,
`header` e `footer`.

- `master` aparece em todas as páginas.
- `first` aparece na primeira.
- `continuation` aparece apenas nas páginas do meio.
- `last` aparece na última quando há mais de uma página.
- `{page}` e `{pages}` são resolvidos depois da paginação.
- Layers de página não participam da colisão do corpo.
- `locked: true` impede patches runtime naquele elemento.

## 11. Use imagens explicitamente

```yaml
- id: hero
  type: image
  asset: images/hero.png
  x: 20mm
  y: 40mm
  width: 170mm
  height: 70mm
  image:
    fit: cover
    focal_x: 500000
    focal_y: 350000
    crop: { left: 0, top: 0, right: 0, bottom: 0 }
    respect_exif: true
```

`fit` aceita `contain`, `cover`, `fill`, `none` e `scale_down`. Foco e crop
usam partes por milhão entre `0` e `1000000`. O runner deve fornecer o mesmo
resolver de assets ao layout e ao export. Caminhos são resolvidos numa raiz
canônica limitada; traversal e symlinks de escape são rejeitados.

## 12. Posicione com guides, regions, anchors e constraints

```yaml
guides:
  content-left: 15mm

regions:
  body: { x: 15mm, y: 25mm, width: 180mm, height: 245mm }

elements:
  - id: card
    type: rect
    region: body
    anchors: { left: "guide:content-left" }
    constraints:
      min_width: 40mm
      preferred_width: 60mm
      max_width: 90mm
      preferred_height: 30mm
      aspect_ratio: 2000000
    align_y: center
```

- `guides` são coordenadas nomeadas.
- `regions` são containers retangulares nomeados e podem ter `collision`.
- `region` escolhe o container do elemento.
- `anchors` conecta uma borda a guide ou elemento anterior, com offset opcional.
- `constraints` aceita `min_width`, `preferred_width`, `max_width`,
  `min_height`, `preferred_height`, `max_height` e `aspect_ratio` em
  milionésimos.
- `align_x`/`align_y` aceitam `start`, `center`, `end`; não combine alinhamento
  e coordenada explícita no mesmo eixo.

## 13. Transforme sem alterar o conteúdo

```yaml
transform:
  translate_x: 2mm
  translate_y: 0mm
  rotate: -15
  scale_x: 1000000
  scale_y: 1000000
  flip_x: false
  flip_y: false
  mirror: none
  origin_x: 50%
  origin_y: 50%
```

Escalas usam milionésimos. `mirror` aceita `none`, `horizontal`, `vertical` ou
`both`. O transform é resolvido antes da colisão e é consumido igualmente por
todos os exporters gráficos.

## 14. Controle colisão e áreas proibidas

Forma simples:

```yaml
collision: false
```

Forma completa:

```yaml
collision:
  enabled: true
  group: content
  collides_with: [content, exclusion]
  ignore: [decorative-line]
  priority: 10
  movable: true
  bounds: layout
  policy: push
```

`bounds` seleciona o bound de colisão suportado pelo contrato. `policy` aceita
`push`, `error`, `overlay`, `next_page` ou `shrink`. A herança é documento →
página → region → group → elemento.

Reserve uma área que não é pintada:

```yaml
exclusions:
  header-clearance:
    x: 0mm
    y: 0mm
    width: 100%
    height: 18mm
    group: exclusion
    collides_with: [content]
```

## 15. Reutilize components e includes

```yaml
components:
  metric-card:
    props:
      label: Metric
    slots:
      detail: []
    elements:
      - { id: surface, type: rect, x: 0mm, y: 0mm, width: 50mm, height: 25mm }

elements:
  - id: requests-card
    type: group
    component: metric-card
    props: { label: Requests }
```

`components` declara `props`, slots substituíveis e elementos. Uma instância
usa `component`, `props` e `slots`. IDs expandidos recebem namespace seguro.

```yaml
includes:
  - path: fragments/header.yml
    namespace: report
```

`includes` são resolvidos por um resolver sandboxed. `namespace` evita colisão
de IDs. Includes não podem assumir o controle das layers físicas da página.

## 16. Declare intenção para o bridge de IA

```yaml
ai:
  purpose: "Maintain a bounded monthly report."
  rules:
    - "Preserve page numbering."
    - "Never remove the confidential watermark."
  editable: [report-title, results]
  locked: [confidential, page-number]
```

O core determinístico apenas preserva essa política. Somente o bridge opcional
`appcore-filemaker-ai` a interpreta. `purpose` descreve o objetivo, `rules`
impõe regras textuais, `editable` lista IDs editáveis e `locked` lista IDs que
o bridge não pode alterar.

## Referência completa do topo do YAML

| Campo | Obrigatório | Função |
|---|---:|---|
| `filemaker` | sim | versão, exatamente `"1.0"` |
| `model` | sim | `document`, `canvas` ou `dataset` |
| `id` | sim | ID lógico estável |
| `page` | não | geometria, margens e layers físicas |
| `collision` | não | política herdada de colisão |
| `includes` | não | fragments resolvidos explicitamente |
| `components` | não | componentes reutilizáveis |
| `themes` | não | temas, herança, tokens e style |
| `theme` | não | tema ativo |
| `style` | não | style global do template |
| `styles` | não | styles nomeados |
| `guides` | não | posições nomeadas |
| `regions` | não | containers retangulares nomeados |
| `exclusions` | não | áreas não pintadas reservadas |
| `data_schema` | não | contrato de dados tipados |
| `elements` | não | elementos raiz em ordem estável |
| `ai` | não | intenção para bridges externos |

## Referência completa de um elemento

| Campo | Função |
|---|---|
| `id` | ID único de 1–128 caracteres ASCII seguros |
| `type` | tipo do elemento |
| `component` | componente instanciado |
| `props` | propriedades da instância |
| `slots` | conteúdo de slots nomeados |
| `x`, `y`, `width`, `height` | geometria com unidade |
| `constraints` | mínimos, preferidos, máximos e aspect ratio |
| `align_x`, `align_y` | alinhamento no container |
| `text` | texto literal |
| `text_options` | overflow, linhas, tamanho mínimo e escrita |
| `table` | configuração obrigatória de `type: table` |
| `asset` | referência explícita de imagem |
| `image` | fit, foco, crop e EXIF |
| `path` | comandos vetoriais |
| `styles` | lista de styles nomeados |
| `style` | style inline |
| `style_rules` | styles condicionais ordenados |
| `transform` | translação, rotação, escala e espelhamento |
| `layout` | absolute ou flow |
| `distribute` | distribuição dos filhos do flow |
| `gap` | distância entre filhos |
| `binding` | expressão do dado principal |
| `when` | condição de visibilidade |
| `repeat` | expressão de array para repetição |
| `anchors` | anchors nomeados |
| `region` | region contendo o elemento |
| `children` | filhos do elemento/group |
| `locked` | bloqueia patches runtime |
| `hidden` | inicia oculto |
| `layer` | nome da layer visual |
| `z_index` | ordem dentro da layer |
| `collision` | override de colisão do elemento |

Nem todo campo serve para todo tipo. `text_options` vale em `text`; tabelas
aceitam somente `min_font_size`, `line_height` e `writing_mode`, pois o planner
da tabela controla overflow e limites de linhas das células. `table` e um
`binding` de array são obrigatórios em `table`; comandos `path` só são válidos
em `line`, `path` ou `polygon`; uma tabela não aceita children ou slots.

## Ordem recomendada de trabalho

1. Comece com `filemaker`, `model`, `id`, `page` e um texto.
2. Execute `check`.
3. Registre a fonte e execute `validate`.
4. Adicione `data_schema` e o JSON tipado separado.
5. Crie tokens/styles antes de repetir style inline.
6. Adicione grupos e tabelas em blocos pequenos.
7. Use `inspect`, `explain` e `debug` quando o layout surpreender.
8. Execute `preflight --strict` para o formato final.
9. Renderize somente depois que o preflight estiver limpo.

Use `appcore-filemaker schema --json` e
`appcore-filemaker capabilities --json` como referência executável do binário
instalado. Veja também o
[exemplo básico](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/basic.yml)
e o
[exemplo intermediário](https://github.com/dnettoRaw/AppCore-Runtime/blob/beta/crates/appcore-filemaker/examples/intermediate.yml).
