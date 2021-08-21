import {Response, Request} from "express";
import {MethodNotAllowedError} from "./error"

export interface Controller {
    get(): void

    post(): void

    put(): void

    delete(): void
}

export class Controller {
    private req: Request
    private resp: Response
    private UIContext: any = {context: {}}
    protected params: any

    constructor(req: Request, resp: Response) {
        this.req = req;
        this.resp = resp;
        this.params = {...req.body, ...req.params, ...req.query}
        this.handleUserSessionContext()
    }

    private handleUserSessionContext() {
        const loggedUser = this.getSessionContext('loggedUser')
        if (loggedUser)
            this.setUIContext('loggedUser', loggedUser)
    }

    render(templateName: string) {
        if (!this.UIContext['title']) this.setTitle(templateName)
        this.resp.render(templateName, this.UIContext)
    }

    setTitle(name: string) {
        this.UIContext['title'] = `${name} - 网上招聘系统`
    }

    redirect(path: string) {
        this.resp.redirect(path)
    }

    setSessionContext(name: string, context: any) {
        // @ts-ignore
        this.req.session.context[name] = context
    }

    setUIContext(name: string, context: any) {
        this.UIContext.context[name] = context
    }

    getSessionContext(name: string) {
        // @ts-ignore
        return this.req.session.context[name]
    }

    renderMessage(msg: string, title: string = '消息') {
        this.setTitle(title)
        this.setUIContext('title', title)
        this.setUIContext('msg', msg)
        this.setUIContext('referer', this.req.header('referer'))
        this.resp.setHeader('refresh', `3;url=${this.req.header('referer')}`)
        this.render('message')
    }
}

export async function handle(req: Request, resp: Response, handlerClass: any) {
    try {
        const handler = new handlerClass(req, resp)
        const method: string = req['method'].toLowerCase()
        if (handler[method]) await handler[method]()
        else throw new MethodNotAllowedError()
    } catch (error) {
        resp.status(error.status || 500)
        resp.render('error.html', {title: '错误', error})
    }
}
