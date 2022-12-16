const isDeployPreview = require('./isDeployPreview')

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
  require('../github/index'),
]
