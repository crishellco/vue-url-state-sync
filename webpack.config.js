const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ['./src/index.js'],
  externals: {
    qs: {
      commonjs: 'qs',
      commonjs2: 'qs',
      amd: 'qs',
      root: 'qs'
    },
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  },
  output: {
    library: 'VueUrlStateSync',
    libraryTarget: 'umd',
    filename: 'index.js',
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  optimization: {
    minimize: true
  },
  plugins: [new VueLoaderPlugin()]
};
