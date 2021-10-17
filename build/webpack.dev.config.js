// const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const commonConfig = require('./webpack.config');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: 'errors-only',
  plugins: [
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
  devServer: {
    compress: true,
    port: 15000,
    hot: true,
    host: 'localhost',
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    proxy: {
      context: () => true,
      target: 'http://localhost:3000',
    },
  },
};

module.exports = merge(commonConfig, devConfig);
