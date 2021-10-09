const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./webpack.config');

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
};

module.exports = merge(commonConfig, devConfig);
