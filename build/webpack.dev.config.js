const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const path = require('path');
const commonConfig = require('./webpack.config');
const { fromSrc } = require('../src/lib/pathUtil');

const devConfig = {
  entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'],
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractCssPlugin({
      filename: '[name].css',
      chunkFilename: '[name].chunk.css',
      ignoreOrder: false,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJsPlugin({
        include: ['chunk-vendors.js'],
      }),
    ],
  },
};

module.exports = merge(commonConfig, devConfig);
