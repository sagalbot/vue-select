var merge = require('webpack-merge')

var baseWebpackConfig = require('../../build/webpack.base.conf')

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      '../../node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
      '**/*.js'
    ],
    reporters: ['spec', 'coverage'],
    preprocessors: {
      '**/*.js': ['webpack', 'sourcemap']
    },
    captureConsole: true,
    browserConsoleLogOptions: {
      terminal: true,
      level: ""
    },

    webpack: merge(baseWebpackConfig, {
      entry: './dev/dev.js'
    }),

    webpackMiddleware: {
      noInfo: true
    },

    specReporter: {
      suppressSkipped: true
    },

    coverageReporter: {
      instrumenters: { isparta: require('isparta') },
      instrumenter: {
        '**/*.js': 'isparta'
      }
    }
  })
}