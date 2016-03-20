
module.exports = {
  entry: './demo/entry.js',

  output: {
    path: __dirname,
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
  }
}

