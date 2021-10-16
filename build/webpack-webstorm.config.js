const path = require('path');
const webpack = require('webpack');

function fromSrc() {
  return path.resolve('../src');
}

module.exports = {
  entry: [path.resolve(__dirname, '../src/ui/entry.js')],
  context: fromSrc(),
  resolve: {
    alias: {
      '@': fromSrc(),
      '@pages': path.resolve(fromSrc(), './ui/pages'),
      '@public': path.resolve(fromSrc(), './ui/public'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  externalsType: 'script',
  externals: {
    vue:
      process.env.NODE_ENV === 'development'
        ? 'Vue@https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.js'
        : 'Vue@https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.prod.js',
  },
};
