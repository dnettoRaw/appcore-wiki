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
          editUrl: 'https://github.com/appcore/appcore-wiki/tree/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'AppCore Runtime',
      items: [
        {to: '/en/', label: 'English', position: 'left'},
        {to: '/pt/', label: 'Português', position: 'left'},
        {to: '/fr/', label: 'Français', position: 'left'},
        {to: '/en/architecture/overview', label: 'Architecture', position: 'left'},
        {to: '/en/development/roadmap', label: 'Roadmap', position: 'left'},
        {href: 'https://github.com/appcore/appcore-wiki', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'Documentation', items: [
          {label: 'English', to: '/en/'},
          {label: 'Português', to: '/pt/'},
          {label: 'Français', to: '/fr/'},
        ]},
        {title: 'Project', items: [
          {label: 'Contributing', to: '/en/development/contributing'},
          {label: 'Roadmap', to: '/en/development/roadmap'},
          {label: 'Project Status', to: '/en/introduction/project-status'},
        ]},
      ],
      copyright: `Copyright ${new Date().getFullYear()} AppCore contributors.`,
    },
    prism: {
      additionalLanguages: ['rust', 'toml'],
    },
  },
};

module.exports = config;
