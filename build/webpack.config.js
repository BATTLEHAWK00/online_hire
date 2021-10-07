const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require('webpackbar');

require('./fileScanner')

module.exports = {
    entry: path.resolve(__dirname, "../src/ui/entry.js"),
    mode: "development",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "main.js",
        publicPath: "/",
        hashFunction: 'sha1',
        hashDigest: 'hex',
        hashDigestLength: 10,
    },
    plugins: [
        new WebpackBar()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/
            }
        ]
    }
}