// @ts-check

const chapters = [
  'introduction/what-is-appcore',
  'architecture/three-artifact-contract',
  'architecture/bootstrap',
  'architecture/storage',
  'architecture/synchronization',
  'architecture/distributed',
  'architecture/supervisor',
  'architecture/updates',
  'security/security-model',
  'architecture/providers',
  'tutorials/first-application',
];

const examples = [
  'index',
  'standalone-ping',
  'command-event-query',
  'scheduled-task',
  'standalone-to-cluster',
];

const crates = [
  'appcore-contracts',
  'appcore-types',
  'appcore-transport',
  'appcore-supervisor',
  'appcore-distributed-contracts',
  'appcore-dnt',
  'appcore-core',
  'appcore-api',
  'appcore-security',
  'appcore-storage',
  'appcore-sync',
  'appcore-ops',
  'appcore-scheduler',
  'appcore-control-plane',
  'appcore-capabilities',
  'appcore-peer-rpc',
  'appcore-gateway',
  'appcore-provider',
  'appcore-provider-vercel-neon',
  'appcore-update',
  'appcore-bin',
];

const crateLabels = {
  en: 'Crate reference (21)',
  pt: 'Referência dos crates (21)',
  fr: 'Référence des crates (21)',
};

const exampleLabels = {
  en: 'Examples — basic to intermediate',
  pt: 'Exemplos — básico ao intermediário',
  fr: 'Exemples — débutant à intermédiaire',
};

const languageCategory = (language, label) => ({
  type: 'category',
  label,
  collapsed: language !== 'en',
  items: [
    `${language}/index`,
    ...chapters.map((chapter) => `${language}/${chapter}`),
    {
      type: 'category',
      label: exampleLabels[language],
      collapsed: true,
      items: examples.map(
        (example) => `${language}/tutorials/examples/${example}`,
      ),
    },
    `${language}/architecture/crate-map`,
    {
      type: 'category',
      label: crateLabels[language],
      collapsed: true,
      items: [
        `${language}/crates/index`,
        ...crates.map((crate) => `${language}/crates/${crate}`),
      ],
    },
  ],
});

module.exports = {
  tutorialSidebar: [
    'index',
    languageCategory('en', 'English'),
    languageCategory('pt', 'Português'),
    languageCategory('fr', 'Français'),
  ],
};
