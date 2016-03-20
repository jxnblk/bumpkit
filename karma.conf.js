
var webpack = require('webpack')

var configuration = {
  browsers: [
    'Firefox'
  ],

  singleRun: true,

  files: [
    'test/index.js'
  ],

  frameworks: [
    'mocha'
  ],

  plugins: [
    'karma-firefox-launcher',
    'karma-mocha',
    'karma-mocha-reporter',
    'karma-webpack'
  ],

  preprocessors: {
    'test/index.js': [
      'webpack'
    ]
  },

  reporters: [
    'mocha'
  ],

  webpack: {
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    }
  },

  webpackMiddleware: {
    noInfo: true
  },

  client: {
    mocha: {
      reporter: 'html',
      ui: 'bdd'
    }
  }

}

if (process.env.TRAVIS) {
  config.autoWatch = false
}

module.exports = function (config) {
  config.set(configuration)
}

