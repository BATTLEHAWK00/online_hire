const OptimizeCSSPlugin = require('css-minimizer-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const commonConfig = require('./webpack.config');

const prodConfig = {
  mode: 'production',
  devtool: false,
  plugins: [
    new ExtractCssPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[chunkhash].chunk.css',
      ignoreOrder: false,
    }),
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
      new OptimizeCSSPlugin({
        parallel: true,
      }),
      new TerserJsPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            passes: 2,
            warnings: true,
            drop_debugger: true,
          },
        },
      }),
    ],
  },
};

module.exports = merge(commonConfig, prodConfig);
