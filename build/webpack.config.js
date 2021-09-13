const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require('webpackbar');

require('./fileScanner')

module.exports = {
    entry: path.resolve(__dirname, "../src/ui/entry"),
    mode: "development",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name]-[hash].js",
        publicPath: "/",
        hashFunction: 'sha1',
        hashDigest: 'hex',
        hashDigestLength: 10,
    },
    plugins: [
        new WebpackBar(),
        new HtmlWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.njk$/,
                use: [
                    {
                        loader: 'html-loader', // 使用 html-loader 处理图片资源的引用
                        options: {
                            attrs: ['img:src', 'img:data-src']
                        }
                    },
                    {
                        loader: 'nunjucks-html-loader', // 使用 ejs-html-loader 处理 .ejs 文件的 includes 语法
                        options: {
                            production: process.env.ENV === 'production'
                        }
                    }
                ]
            }
        ]
    }
}