import webpack from 'webpack';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackDevMiddleware from 'webpack-dev-middleware';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackHotMiddleware from 'webpack-hot-middleware';

// @ts-ignore
import webpackConfig from '../../build/webpack.config';

const compiler = webpack(webpackConfig);

// @ts-ignore
export const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  // stats: 'errors-only'
});

export const hotMiddleware = webpackHotMiddleware(compiler);
