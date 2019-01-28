var merge = require('webpack-merge')

var baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  entry: './src/index.js',
  output: {
    filename: 'vue-select.js',
    library: 'VueSelect',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this"
  }
});
