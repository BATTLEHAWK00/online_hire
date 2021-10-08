import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const webpackConfig = require('../../build/webpack.config.js')

const compiler = webpack(webpackConfig)

export const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    // stats: 'errors-only'
})

export const hotMiddleware = webpackHotMiddleware(compiler)