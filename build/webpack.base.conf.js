var webpack = require('webpack')
var VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var path = require('path')
var chokidar = require('chokidar');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode: env,
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: env === 'production' ? 'source-map' : 'eval-source-map',
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../docs/assets'),
      'mixins': path.resolve(__dirname, '../src/mixins'),
      'components': path.resolve(__dirname, '../src/components'),
      'docs': path.resolve(__dirname, '../docs'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../'),
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'vue-html-loader'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new MiniCssExtractPlugin({
      filename: 'vue-select.css'
    }),
    new VueLoaderPlugin()
  ],
  devServer: {
    hot: true,
    hotOnly: true,
    inline: true,
    port: 8080,
    before(app, server) {
      chokidar.watch([
        './**/*.html'
      ]).on('all', function () {
        server.sockWrite(server.sockets, 'content-changed');
      })
    }
  }
}
