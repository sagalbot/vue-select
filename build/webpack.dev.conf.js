const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  entry: './dev/dev.js',
  devServer: {
    open: true,
    static: false,
    client: { overlay: true },
    watchFiles: ['dev/dev.html'],
  },
  stats: false,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'dev',
      template: './dev/dev.html',
      inject: true,
    }),
  ],
})
