# AppCore Wiki

Public Docusaurus documentation for AppCore Runtime.

The wiki tracks AppCore Runtime `1.0.1-rc.8` (MSRV Rust `1.89`) and includes a
dedicated reference page for each of the 21 Runtime crates published on
crates.io, plus a progressive example path from standalone command handling to
scheduled work and cluster composition.

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
