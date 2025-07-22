'use strict'

const path = require('path')
const os = require('os')
const defaultSettings = require('../src/settings.js')
const webpack = require('webpack')
const TimeFixPlugin = require('time-fix-plugin')
const WebpackBar = require('webpackbar')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const definePlugin = new webpack.DefinePlugin({
'process.env.REACT_APP_GRPC_URL': JSON.stringify(process.env.REACT_APP_GRPC_URL),
'process.env.GRPC_TARGET_URL': JSON.stringify(process.env.GRPC_TARGET_URL),
});
const name = defaultSettings.title || 'React' // page title
module.exports = {
  entry: {
    app: './src/main.js',
    // framework: ['react', 'react-dom'],
  },
  output: {
    publicPath: '/',
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  name: name,
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.jsx'],
    alias: {
      '@': path.join(__dirname, '..', 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: [path.resolve(__dirname, '../src')],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['import', { libraryName: 'antd', style: true }],
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-transform-runtime',
            ],
          },
        },
      },

      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192,
          },
        },
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'font/',
          },
        },
      },
    ],
  },
  plugins: [
  new Dotenv(),
    definePlugin,
    new TimeFixPlugin(),
    new WebpackBar({
      name: 'Build',
      profile: true,
      reporters: ['basic', 'fancy', 'profile'],
    }),
    new HardSourceWebpackPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /dayjs$/),
  ],
  devtool: 'cheap-module-eval-source-map',
  optimization: {
    removeAvailableModules: true, 
    removeEmptyChunks: true, 
    mergeDuplicateChunks: true, 
  },
}
