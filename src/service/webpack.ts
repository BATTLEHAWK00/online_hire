import webpack from 'webpack';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackDevMiddleware from 'webpack-dev-middleware';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackHotMiddleware from 'webpack-hot-middleware';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require('../../build/webpack.dev.config');

const compiler = webpack(webpackConfig);

export const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  // stats: 'errors-only'
});

export const hotMiddleware = webpackHotMiddleware(compiler);
