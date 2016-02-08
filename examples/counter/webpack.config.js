var path = require('path');
var webpack = require('webpack');


module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    path.join(__dirname, 'client.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"'
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: __dirname,
      query: {
        babelrc: false,
        presets: ['react', 'es2015', 'stage-0', 'react-hmre']
      }
    }]
  }
};


var lib = path.join(__dirname, '..', '..', 'src');

module.exports.resolve = {alias: {
  'redux-process': lib
}};
module.exports.module.loaders.push({
  test: /\.js$/,
  loaders: ['babel'],
  include: lib
});
