/* eslint-disable */
const OptimizeCSSPlugin = require('css-minimizer-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config');
const path = require('path');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const prodConfig = {
  mode: 'production',
  devtool: false,
  plugins: [
    new ExtractCssPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[chunkhash].chunk.css',
      ignoreOrder: false,
    }),
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin({
      basePath: '/',
    }),
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSPlugin(),
      new TerserJsPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          compress: {
            warnings: true,
            drop_debugger: true,
          },
        },
      }),
    ],
  },
};

module.exports = merge(commonConfig, prodConfig);
