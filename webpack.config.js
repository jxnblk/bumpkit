
var path = require('path')

module.exports = {
  entry: './demo/entry.js',

  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel'
        ]
      }
    ]
  },

  devServer: {
    contentBase: 'demo'
  }
}

