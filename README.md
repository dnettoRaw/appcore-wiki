# AppCore Wiki

Public Docusaurus documentation for AppCore Runtime.

The wiki documents the current AppCore Runtime catalog of 28 active public
crates (MSRV Rust `1.89`). Every public crate owns its SemVer; the repository
release train is `1.0.2-rc`, while `appcore-ai`, FileMaker and other explicitly
marked components remain independent prereleases. crates.io is the authority
for versions that have actually been published. The site includes a progressive
path from standalone command handling to scheduled work, Gateway activation,
document generation and cluster composition.

English is the source locale; Portuguese and French use Docusaurus native
localization:

- `docs`
- `i18n/pt/docusaurus-plugin-content-docs/current`
- `i18n/fr/docusaurus-plugin-content-docs/current`

Crate catalogs:

- `docs/crates`
- `i18n/pt/docusaurus-plugin-content-docs/current/crates`
- `i18n/fr/docusaurus-plugin-content-docs/current/crates`

Progressive examples:

- `docs/tutorials/examples`
- `i18n/pt/docusaurus-plugin-content-docs/current/tutorials/examples`
- `i18n/fr/docusaurus-plugin-content-docs/current/tutorials/examples`

## Local development

```bash
npm install
npm run start
```

Use `npm run start -- --locale pt` or `npm run start -- --locale fr` to preview
a translation locally.

## Build

```bash
npm run build:all
```

The build first runs `docs:locales`. This gate requires the same 58 Markdown
pages in English, Portuguese and French and compares heading structure, code
examples, tables, links, admonitions, list coverage and a bounded word-coverage
ratio. Run it directly while translating:

```bash
npm run docs:locales
```

## Detect Runtime documentation drift

The Node.js checker fingerprints Runtime-owned documentation and the public
crate graph. It does not modify either repository:

```bash
npm run docs:drift -- --runtime /path/to/AppCore-Runtime
```

After reviewing and integrating a reported Runtime change, update the checked-in
baseline explicitly:

```bash
npm run docs:drift:accept -- --runtime /path/to/AppCore-Runtime
```

The command exits with `0` when the wiki baseline matches, `1` when it detects
drift, and `2` for configuration or execution errors. Use `--json` for CI.
