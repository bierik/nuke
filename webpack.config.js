const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = env => ({
  entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'node_modules'),
      assets: path.resolve(__dirname, 'src/assets'),
    },
    extensions: ['*', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env.API_ROOT': JSON.stringify(env && env.production ? 'https://ivis-nuke.herokuapp.com/' : 'http://localhost:8080'),
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/assets'),
        to: path.resolve(__dirname, 'dist/assets'),
      },
    ]),
  ],
  devtool: '#eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    stats: 'errors-only',
  },
});
