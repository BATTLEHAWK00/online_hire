import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import {
  contextMiddleware,
  ipRecordMiddleware,
  sessionMiddleware,
} from './middlewares/session';
import Router from './router';
import { registerNunjucks } from './nunjucks';
import { errorHandleMiddleware } from './middlewares/errorhandler';
import { NotFoundError } from './error';

async function InitExpress() {
  const app = express();
  const middlewares = [];

  middlewares.push(helmet.hidePoweredBy());
  middlewares.push(helmet.xssFilter());

  // 注册Nunjucks模板引擎
  registerNunjucks(app);

  // 启用Gzip压缩
  middlewares.push(compression());

  // 路由日志记录
  middlewares.push(logger('dev'));

  // Webpack中间件配置
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const { devMiddleware, hotMiddleware } = require('./webpack');
    middlewares.push(devMiddleware);
    middlewares.push(hotMiddleware);
    console.log('Using Webpack Dev Middleware.');
  }

  // 处理ResponseBody
  middlewares.push(express.json());
  // 处理RequestBody
  middlewares.push(express.urlencoded({ extended: false }));
  // 处理Cookie
  middlewares.push(cookieParser());
  // 处理静态文件
  middlewares.push(express.static(path.join(__dirname, '../../dist')));

  // 处理Session
  middlewares.push(sessionMiddleware);
  // 处理Session Context
  middlewares.push(contextMiddleware);
  // 在Session中记录IP
  middlewares.push(ipRecordMiddleware);

  // 路由配置
  middlewares.push(Router.router);

  function handle404(req: Request, res: Response, next: NextFunction) {
    next(NotFoundError());
  }

  // 处理404
  middlewares.push(handle404);
  // 处理异常
  middlewares.push(errorHandleMiddleware);

  // 向Express注册中间件
  middlewares.forEach(middleware => app.use(middleware));

  return app;
}

export default {
  InitExpress,
};
