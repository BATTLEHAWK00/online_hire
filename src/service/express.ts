import express, {NextFunction, Request, Response} from "express";
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

export const app = express();

// 配置模板引擎
import nunjucks from 'nunjucks';

const templatePath: string = path.join(__dirname, '../ui/views')
nunjucks.configure(templatePath, {
    autoescape: true,
    express: app,
    watch: true
});
app.set('views', templatePath);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../ui/public')));

// 配置Session
import session from 'express-session';
import MongoStore from 'connect-mongo'

app.use(session({
    secret: 'online-hire',
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 1000 * 60 * 60},
    store: new MongoStore({
        mongoUrl: 'mongodb://localhost:27017/online_hire',
        collectionName: 'session',
        touchAfter: 24 * 3600,
        autoRemove: "interval",
        autoRemoveInterval: 60
    })
}))

app.use((req: { session: any }, resp, next) => {
    if (!req.session['context']) req.session['context'] = {}
    next()
})

// 配置Router
import indexRouter from '../routes';

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});