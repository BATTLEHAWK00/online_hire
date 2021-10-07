const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require('webpackbar');
const ExtractCssPlugin = require('mini-css-extract-plugin')

require('./fileScanner')

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
    plugins: [
        new WebpackBar(),
        new ExtractCssPlugin({
            filename: '[name].css?[hash]'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ExtractCssPlugin.loader, 'css-loader'],
                exclude: /node_modules/
            }
        ]
    }
}