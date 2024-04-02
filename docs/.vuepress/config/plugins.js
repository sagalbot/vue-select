module.exports = [
  [
    '@vuepress/pwa',
    {
      serviceWorker: false,
      updatePopup: true,
    },
  ],
  '@vuepress/plugin-register-components',
  '@vuepress/plugin-active-header-links',
  '@vuepress/plugin-search',
  '@vuepress/plugin-nprogress',
  [
    'sitemap',
    {
      hostname: 'https://vue-select.org',
    },
  ],
  require('../github/index'),
]
