import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression';
// 配置模板引擎
import nunjucks from 'nunjucks';
import configProvider from '../lib/configProvider';
import { devMiddleware, hotMiddleware } from './webpack';
// 配置过滤器
import registerFilters from '../lib/nunjucks_filter';
// Session配置
import { contextMiddleware, ipRecordMiddleware, sessionMiddleware } from './middlewares/session';
// 配置Router
import indexRouter from '../routes';
// 捕获404并抛出异常
import { NotFoundError } from './error';
import { errorHandleMiddleware } from './middlewares/errorhandler';

// eslint-disable-next-line import/prefer-default-export
export const app = express();

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
const systemContext = configProvider.getGlobalConfig().system;

const middlewares = [];

// 启用Gzip压缩
middlewares.push(compression());

// 路由日志记录
middlewares.push(logger('dev'));

const templatePath: string = path.join(__dirname, '../ui/templates');
const nunjucksEnv = nunjucks.configure(templatePath, {
  autoescape: true,
  express: app,
  watch: true,
});
app.set('templates', templatePath);
app.set('view engine', 'njk');

middlewares.push(devMiddleware);
middlewares.push(hotMiddleware);

registerFilters(nunjucksEnv);

// 处理ResponseBody
middlewares.push(express.json());
// 处理RequestBody
middlewares.push(express.urlencoded({ extended: false }));
// 处理Cookie
middlewares.push(cookieParser());
// 处理静态文件
middlewares.push(express.static(path.join(__dirname, '../ui/public')));

// 处理Session
middlewares.push(sessionMiddleware);
// 处理Session Context
middlewares.push(contextMiddleware);
// 在Session中记录IP
middlewares.push(ipRecordMiddleware);

// 路由配置
middlewares.push(indexRouter);

function handle404(req: Request, res: Response, next: NextFunction) {
  next(new NotFoundError());
}

// 处理404
middlewares.push(handle404);
// 处理异常
middlewares.push(errorHandleMiddleware);

middlewares.forEach(middleware => app.use(middleware));
