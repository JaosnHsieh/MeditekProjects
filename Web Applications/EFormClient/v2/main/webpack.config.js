var path = require('path')
var webpack = require('webpack')
module.exports = {
  entry: {
    'eFormTemplateDetail': path.join(process.cwd(), 'modules/eFormTemplate/detail'),
    'eFormDetail': path.join(process.cwd(), 'modules/eForm/detail'),
    'eFormTemplateList': path.join(process.cwd(), 'modules/eFormTemplate/list'),

  },
  output: {
    path: '../server/public/',
    publicPath: '/public/',
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
      /*alias: {
          'react': 'react-lite',
          'react-dom': 'react-lite'
      }*/
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: { warnings: false },
    //   comments: false,
    //   sourceMap: false,
    //   mangle: true,
    //   minimize: true
    // })
  ]
}