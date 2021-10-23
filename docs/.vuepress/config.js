const { description } = require('./config/meta')
const head = require('./config/head')
const plugins = require('./config/plugins')
const themeConfig = require('./config/themeConfig')
const { resolve } = require('path')

module.exports = {
  title: 'Vue Select',
  description,
  head,
  plugins,
  themeConfig,
  alias: {
    'vue-select': resolve(__dirname, '../../src'),
  },
}
