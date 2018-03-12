var path = require('path')
var webpack = require('webpack');

module.exports = {
  entry: './index.web.js',
  devtool: "eval-source-map",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          sourceMaps: true,
          retainLines: true,
          cacheDirectory: true,
          presets: ['react-native']
        }
      },
      {
        test: /\.css$/,
        exclude: /^node_modules$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
      'react': 'react-v-15.6'
    }
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: __dirname + '/public'
  }
};
