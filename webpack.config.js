//@ts-check

'use strict';

const {resolve} = require('path');

const config = {
  target: 'node',
  mode: 'development',
  entry: './src/extension.ts',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  devtool: 'nosources-source-map',
  externals: {vscode: 'commonjs vscode'},
  resolve: {extensions: ['.ts', '.js']},
  module: {
    rules: [
      {test: /\.html$/, type: 'asset/source'},
      {test: /\.ts$/, exclude: /node_modules/, use: [{loader: 'ts-loader'}]},
    ]
  }
};

module.exports = config;