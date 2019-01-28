var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  entry: './dev/dev.js',
  module: {
    rules: [{
      test: /\.md$/,
      loader: "html!markdown-code-highlight-loader"
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './dev/dev.html',
      inject: true
    })
  ],
  optimization: {
    noEmitOnErrors: true
  }
})
