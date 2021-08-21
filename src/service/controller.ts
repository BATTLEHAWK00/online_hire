import {Express} from "express";

export interface Controller {
    get(): void

    post(): void

    put(): void

    delete(): void
}

export class Controller {
    private req: Express.Request
    private resp: Express.Response
    protected UIContext: any = {}
    protected params: any

    constructor(req: Express.Request, resp: Express.Response) {
        this.req = req;
        this.resp = resp;
        // @ts-ignore
        this.params = {...req.params, ...req.query}
        // @ts-ignore
        console.log(req.params)
    }

    render(templateName: string) {
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
}

export async function handle(req: Express.Request, resp: Express.Response, handlerClass: any) {
    const handler = new handlerClass(req, resp)
    // @ts-ignore
    const method: string = req['method'].toLowerCase()
    if (handler[method]) handler[method]()
}
