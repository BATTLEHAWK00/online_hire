const path = require('path');
const WebpackBar = require('webpackbar');
const ExtractCssPlugin = require('mini-css-extract-plugin')
const {VueLoaderPlugin} = require('vue-loader');
const webpack = require("webpack");

module.exports = {
    entry: path.resolve(__dirname, "../src/ui/entry.js"),
    mode: "development",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].js?[hash]",
        publicPath: "/",
        hashFunction: 'sha1',
        hashDigest: 'hex',
        hashDigestLength: 10,
        chunkFilename: '[name].[chunkhash].chunk.js',
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30,
            minChunks: 1,
            maxAsyncRequests: 6,
            maxInitialRequests: 4,
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendors: {
                    name: `chunk-vendors`,
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },
                common: {
                    name: `chunk-common`,
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new WebpackBar(),
        new ExtractCssPlugin({
            filename: '[name].css?[hash]'
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [ExtractCssPlugin.loader, 'vue-style-loader', 'css-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.styl(us)?$/,
                use: [ExtractCssPlugin.loader, 'css-loader', 'stylus-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
        ]
    }
}