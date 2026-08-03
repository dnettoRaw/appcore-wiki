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
  'architecture/crate-map',
];

const languageCategory = (language, label) => ({
  type: 'category',
  label,
  collapsed: language !== 'en',
  items: [`${language}/index`, ...chapters.map((chapter) => `${language}/${chapter}`)],
});

module.exports = {
  tutorialSidebar: [
    'index',
    languageCategory('en', 'English'),
    languageCategory('pt', 'Português'),
    languageCategory('fr', 'Français'),
  ],
};
