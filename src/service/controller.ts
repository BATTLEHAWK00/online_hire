import { Request, Response } from 'express';
import { MethodNotAllowedError, UnauthorizedError } from './error';

// export interface ControllerMethods {
//     get(): void
//
//     post(): void
//
//     put(): void
//
//     delete(): void
// }

export class Controller {
  protected req: Request;

  protected resp: Response;

  private UIContext: any = {};

  protected params: any;

  private __handleTime: number;

  private __renderTime: number | undefined;

  constructor(req: Request, resp: Response) {
    this.__handleTime = Date.now();
    this.req = req;
    this.resp = resp;
    this.params = { ...req.body, ...req.params, ...req.query };
  }

  render(templateName: string) {
    this.__renderTime = Date.now();
    if (!this.UIContext.pageTitle) this.setTitle(templateName);
    this.setUIContext('pageName', templateName);
    this.setUIContext('loggedUser', this.getSessionContext('loggedUser'));
    this.resp.render(templateName, {
      ...this.UIContext,
      UIContext: this.UIContext,
      handler: this,
    });
  }

  setTitle(name: string) {
    this.setUIContext('pageTitle', `${name} - 网上招聘系统`);
  }

  redirect(path: string) {
    this.resp.redirect(path);
  }

  setSessionContext(name: string, context: any) {
    // @ts-ignore
    this.req.session.context[name] = context;
  }

  setUIContext(name: string, context: any) {
    this.UIContext[name] = context;
  }

  getSessionContext(name: string) {
    // @ts-ignore
    return this.req.session.context[name];
  }

  renderMessage(msg: string, redirectPath?: string, title = '消息') {
    this.setTitle(title);
    this.setUIContext('title', title);
    this.setUIContext('msg', msg);
    const redirectTo = redirectPath || this.req.header('referer');
    this.setUIContext('referer', redirectTo);
    this.resp.setHeader('refresh', `3;url=${redirectTo}`);
    this.render('message');
  }
}

export async function handle(req: Request, resp: Response, HandlerClass: any) {
  try {
    const handler = new HandlerClass(req, resp);
    const method: string = req.method.toLowerCase();
    if (handler.__requireAuth && !handler.getSessionContext('loggedUser'))
      throw new UnauthorizedError('你还没有登录！');
    if (handler[method]) await handler[method]();
    else throw new MethodNotAllowedError();
  } catch (error: any) {
    console.log(error);
    resp.status(error.status || 500);
    resp.render('error', { title: '错误', error });
  }
}
