import {Express} from "express";
import {MethodNotAllowedError} from "./error"

export interface Controller {
    get(): void

    post(): void

    put(): void

    delete(): void
}

export class Controller {
    private req: Express.Request
    private resp: Express.Response
    private UIContext: any = {context: {}}
    protected params: any

    constructor(req: Express.Request, resp: Express.Response) {
        this.req = req;
        this.resp = resp;
        // @ts-ignore
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
        // @ts-ignore
        this.resp.render(templateName, this.UIContext)
    }

    setTitle(name: string) {
        this.UIContext['title'] = `${name} - 网上招聘系统`
    }

    redirect(path: string) {
        // @ts-ignore
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
}

export async function handle(req: Express.Request, resp: Express.Response, handlerClass: any) {
    try {
        const handler = new handlerClass(req, resp)
        // @ts-ignore
        const method: string = req['method'].toLowerCase()
        if (handler[method]) await handler[method]()
        else throw new MethodNotAllowedError()
    } catch (error) {
        // @ts-ignore
        resp.status(error.status || 500)
        // @ts-ignore
        resp.render('error.html', {title: '错误', error})
    }
}