import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const webpackConfig = require('../../build/webpack.config.js')

const compiler = webpack(webpackConfig)

export const devMiddleware = webpackDevMiddleware(compiler, {
    //这里的publicPath一定要与webpack配置的publicPath一致
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true
    },
})

export const hotMiddleware = webpackHotMiddleware(compiler)