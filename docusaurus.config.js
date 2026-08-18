// @ts-check

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
          if (process.env.DOCUSAURUS_CURRENT_LOCALE !== 'en') {
            return undefined;
          }

          return existingPath === '/' ? '/en/' : `/en${existingPath}`;
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
