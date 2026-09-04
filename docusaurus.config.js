// @ts-check

const stableCrateIds = {
  '/crates/appcore-args': 'acr-001',
  '/crates/appcore-contracts': 'acr-002',
  '/crates/appcore-types': 'acr-003',
  '/crates/appcore-transport': 'acr-004',
  '/crates/appcore-supervisor': 'acr-005',
  '/crates/appcore-distributed-contracts': 'acr-006',
  '/crates/appcore-dnt': 'acr-007',
  '/crates/appcore-core': 'acr-008',
  '/crates/appcore-api': 'acr-009',
  '/crates/appcore-security': 'acr-010',
  '/crates/appcore-storage': 'acr-011',
  '/crates/appcore-sync': 'acr-012',
  '/crates/appcore-ops': 'acr-013',
  '/crates/appcore-scheduler': 'acr-014',
  '/crates/appcore-control-plane': 'acr-015',
  '/crates/appcore-capabilities': 'acr-016',
  '/crates/appcore-peer-rpc': 'acr-017',
  '/crates/appcore-gateway': 'acr-018',
  '/crates/appcore-provider': 'acr-019',
  '/crates/appcore-provider-vercel-neon': 'acr-020',
  '/crates/appcore-update': 'acr-021',
  '/crates/appcore-ai': 'acr-022',
  '/crates/appcore-filemaker': 'acr-023',
  '/crates/appcore-filemaker-ai': 'acr-024',
  '/crates/appcore-filemaker-cli': 'acr-025',
  '/crates/appcore-sync-sqlite': 'acr-026',
  '/crates/appcore-log': 'acr-027',
  '/crates/appcore-sdk': 'acr-028',
};

const config = {
  title: 'AppCore Runtime',
  tagline: 'Official technical documentation for the AppCore Runtime',
  favicon: 'img/favicon.svg',
  url: 'https://wiki.appcore.dnettoraw.com',
  baseUrl: '/',
  organizationName: 'appcore',
  projectName: 'appcore-wiki',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'fr'],
    localeConfigs: {
      en: {label: 'English', htmlLang: 'en'},
      pt: {label: 'Português', htmlLang: 'pt-BR'},
      fr: {label: 'Français', htmlLang: 'fr'},
    },
  },
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects(existingPath) {
          const redirects = [];
          const stableId = stableCrateIds[existingPath];
          if (stableId) {
            redirects.push(`/crates/id/${stableId}`);
          }
          if (process.env.DOCUSAURUS_CURRENT_LOCALE === 'en') {
            redirects.push(existingPath === '/' ? '/en/' : `/en${existingPath}`);
          }
          return redirects.length === 0 ? undefined : redirects;
        },
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/dnettoraw/appcore-wiki/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'AppCore Runtime',
      items: [
        {to: '/architecture/bootstrap', label: 'Architecture', position: 'left'},
        {to: '/security/security-model', label: 'Security', position: 'left'},
        {to: '/crates/', label: 'Crates', position: 'left'},
        {type: 'localeDropdown', position: 'right'},
        {href: 'https://github.com/dnettoraw/appcore-wiki', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {label: 'Architecture', to: '/architecture/bootstrap'},
        {label: 'Security', to: '/security/security-model'},
        {label: 'Crates', to: '/crates/'},
        {label: 'GitHub', href: 'https://github.com/dnettoraw/appcore-wiki'},
      ],
      copyright: `feito com &lt;3 por <a class="dnettoraw-footer-credit" href="https://www.dnettoraw.com" target="_blank" rel="noopener noreferrer"><img src="/img/dnettoraw-logo.svg" alt="" width="18" height="18" loading="lazy" />dnettoraw</a>`,
    },
    prism: {
      additionalLanguages: ['rust', 'toml'],
    },
  },
};

module.exports = config;
