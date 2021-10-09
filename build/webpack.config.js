const path = require('path');
const WebpackBar = require('webpackbar');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const EslintFriendlyFormatter = require('eslint-friendly-formatter');
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: [
    path.resolve(__dirname, '../src/ui/entry.js'),
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
  ],
  mode: 'development',
  devtool: 'source-map',
  externals: {
    vue: 'Vue',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/',
    hashFunction: 'sha1',
    hashDigest: 'hex',
    hashDigestLength: 10,
    chunkFilename: '[id].chunk.js',
  },
  optimization: {
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
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'all',
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new WebpackBar(),
    new ExtractCssPlugin({
      filename: '[name].css',
      chunkFilename: '[id].chunk.css',
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new OptimizeCSSPlugin({
    //     cssProcessorOptions: {safe: true, map: {inline: false}}
    // }),
    // new UglifyJsPlugin({
    //     uglifyOptions: {
    //         compress: true
    //     },
    //     sourceMap: true,
    //     parallel: true
    // }),
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