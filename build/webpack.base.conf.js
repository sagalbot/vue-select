const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const devtool = env === 'production' ? 'source-map' : 'eval-source-map'

const extractOrInjectStyles =
  env !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader

module.exports = {
  mode: env,
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  devtool,
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      src: path.resolve(__dirname, '../src'),
      assets: path.resolve(__dirname, '../docs/assets'),
      mixins: path.resolve(__dirname, '../src/mixins'),
      components: path.resolve(__dirname, '../src/components'),
      vue$: 'vue/dist/vue.runtime.esm-bundler.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../'),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          extractOrInjectStyles,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env,
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'vue-select.css',
    }),
    new VueLoaderPlugin(),
  ],
  stats: {
    children: false,
    modules: false,
  },
}
