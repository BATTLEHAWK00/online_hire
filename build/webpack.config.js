const path = require('path');
const WebpackBar = require('webpackbar');
const ExtractCssPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const EslintFriendlyFormatter = require('eslint-friendly-formatter');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function fromSrc(dir) {
  return path.resolve(__dirname, '../src', dir || '');
}

module.exports = {
  entry: [path.resolve(__dirname, '../src/ui/entry.js')],
  context: fromSrc(),
  resolve: {
    alias: {
      '@': fromSrc(),
      '@pages': path.resolve(fromSrc('./ui/pages')),
      '@public': path.resolve(fromSrc('./ui/public')),
      '@lib': path.resolve(fromSrc('./ui/lib')),
    },
  },
  // externalsType: 'script',
  // externals: {
  //   vue:
  //     process.env.NODE_ENV === 'development'
  //       ? 'Vue@https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.js'
  //       : 'Vue@https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.prod.js',
  // },
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
      automaticNameDelimiter: '-',
      cacheGroups: {
        styles: {
          name: 'chunk-styles',
          test: /\.styl(us)?$/,
          priority: -10,
        },
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          minSize: 0,
          priority: -10,
          chunks: 'all',
        },
        antd: {
          name: `antd-components`,
          test: /ant-design-vue/,
          minSize: 0,
          priority: -5,
          chunks: 'async',
        },
        vueComponents: {
          name: `vue-components`,
          test: /\.vue$/,
          minSize: 0,
          priority: -10,
          chunks: 'async',
        },
        pages: {
          name: `pages`,
          test: /[\\/]pages[\\/]/,
          priority: -15,
        },
        common: {
          name: `common`,
          priority: -20,
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/ant-design-vue\/lib\/style\/index\.less/,
      fromSrc('./ui/public/antd-global.less')
    ),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: fromSrc('ui'), // 指定检查的目录
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
        use: [
          ExtractCssPlugin.loader,
          {
            loader: 'css-loader',
            // options: {
            //   esModule: false,
            // },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          ExtractCssPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.styl(us)?$/,
        use: [
          ExtractCssPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
            },
          },
          'stylus-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif|webp)$/,
        loader: 'url-loader',
        options: {
          limit: 10,
          name: 'static/img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'import',
              {
                libraryName: 'ant-design-vue',
                libraryDirectory: 'es',
              },
            ], // `style: true` 会加载 less 文件
          ],
        },
      },
    ],
  },
};
