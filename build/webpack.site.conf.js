var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  entry: './docs/homepage/home.js',
  output: {
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[id].[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './docs/homepage/home.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: "manifest",
    }
  }
})
