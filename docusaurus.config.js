// @ts-check

const config = {
  title: 'AppCore Runtime',
  tagline: 'Official technical documentation for the AppCore Runtime',
  favicon: 'img/favicon.svg',
  url: 'https://appcore.dev',
  baseUrl: '/',
  organizationName: 'appcore',
  projectName: 'appcore-wiki',
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
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
        {to: '/en/', label: 'English', position: 'left'},
        {to: '/pt/', label: 'Português', position: 'left'},
        {to: '/fr/', label: 'Français', position: 'left'},
        {to: '/en/architecture/bootstrap', label: 'Architecture', position: 'left'},
        {to: '/en/security/security-model', label: 'Security', position: 'left'},
        {href: 'https://github.com/dnettoraw/appcore-wiki', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {label: 'English', to: '/en/'},
        {label: 'Português', to: '/pt/'},
        {label: 'Français', to: '/fr/'},
        {label: 'Architecture', to: '/en/architecture/bootstrap'},
        {label: 'Security', to: '/en/security/security-model'},
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
