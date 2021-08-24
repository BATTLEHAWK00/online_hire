import express, {NextFunction, Request, Response} from "express";
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import configProvider from '../lib/configProvider'

export const app = express();

const systemContext = configProvider.getGlobalConfig().system

const middlewares: any[] = []

// 配置模板引擎
import nunjucks from 'nunjucks';

const templatePath: string = path.join(__dirname, '../ui/views')
const nunjucksEnv = nunjucks.configure(templatePath, {
    autoescape: true,
    express: app,
    watch: true,
});
app.set('views', templatePath);
app.set('view engine', 'html');

//配置过滤器
import registerFilters from "../lib/nunjucks_filter";

registerFilters(nunjucksEnv)

//路由日志记录
middlewares.push(logger('dev'))
//处理ResponseBody
middlewares.push(express.json())
//处理RequestBody
middlewares.push(express.urlencoded({extended: false}))
//处理Cookie
middlewares.push(cookieParser())
//处理静态文件
middlewares.push(express.static(path.join(__dirname, '../ui/public')))

// Session配置
import {sessionMiddleware, contextMiddleware, ipRecordMiddleware} from './middlewares/session'

//处理Session
middlewares.push(sessionMiddleware)
//处理Session Context
middlewares.push(contextMiddleware)
//在Session中记录IP
middlewares.push(ipRecordMiddleware)

// 配置Router
import indexRouter from '../routes';

//路由配置
middlewares.push(indexRouter)

// 捕获404并抛出异常
import {NotFoundError} from "./error";
import {errorHandleMiddleware} from "./middlewares/errorhandler";

function handle404(req: Request, res: Response, next: NextFunction) {
    next(new NotFoundError());
}

//处理404
middlewares.push(handle404)
//处理异常
middlewares.push(errorHandleMiddleware)

middlewares.forEach((middleware) => app.use(middleware))

