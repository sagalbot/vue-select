const TerserPlugin = require('terser-webpack-plugin')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  entry: './src/index.js',
  output: {
    filename: 'vue-select.js',
    library: 'VueSelect',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  externals: {
    vue: 'vue',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
})
