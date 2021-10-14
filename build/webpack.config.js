const path = require('path');
const WebpackBar = require('webpackbar');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const EslintFriendlyFormatter = require('eslint-friendly-formatter');

module.exports = {
  entry: [path.resolve(__dirname, '../src/ui/entry.js')],
  externalsType: 'script',
  externals: {
    vue:
      process.env.NODE_ENV === 'development'
        ? 'Vue@https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.js'
        : 'Vue@https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.prod.js',
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    hashFunction: 'sha1',
    hashDigest: 'hex',
    hashDigestLength: 10,
    chunkFilename: '[name].chunk.js',
  },
  optimization: {
    chunkIds: 'natural',
    splitChunks: {
      chunks: 'async',
      minSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
        styles: {
          name: 'chunk-styles',
          test: /\.css$/,
          chunks: 'all',
          priority: -10,
        },
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all',
        },
        pages:{
          name: `chunk-pages`,
          test: /[\\/]pages[\\/]/,
          priority: -15,
          chunks: 'async',
          reuseExistingChunk: true,
        },
        common: {
          name: `chunk-common`,
          priority: -20,
          chunks: 'async',
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new WebpackBar(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        // include: path.resolve(__dirname, 'src'), // 指定检查的目录
        options: {
          // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
          formatter: EslintFriendlyFormatter, // 指定错误报告的格式规范
          emitWarning: true,
          threads: true,
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [ExtractCssPlugin.loader, 'vue-style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.styl(us)?$/,
        use: [ExtractCssPlugin.loader, 'css-loader', 'stylus-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
};

// console.log(module.exports.optimization);
