import session from "express-session";
import MongoStore from "connect-mongo";

export const sessionMiddleware = session({
    secret: 'online-hire',
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 1000 * 60 * 60},
    store: new MongoStore({
        mongoUrl: 'mongodb://localhost:27017/online_hire',
        collectionName: 'session',
        touchAfter: 3600,
        autoRemove: "interval",
        autoRemoveInterval: 60,
    }),
})

export const ipRecordMiddleware = function (req: { session: any, socket: any }, resp: any, next: any) {
    if (!req.session['create_ip']) req.session['create_ip'] = req.socket.remoteAddress
    if (req.session['update_ip'] != req.socket.remoteAddress)
        req.session['update_ip'] = req.socket.remoteAddress
    next()
}

export const contextMiddleware = function (req: { session: any }, resp: any, next: any) {
    if (!req.session['context']) req.session['context'] = {}
    next()
}