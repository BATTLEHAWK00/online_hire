import { Request, Response } from 'express';
import { MethodNotAllowedError, UnauthorizedError } from './error';

// export interface Controller {
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

  private UIContext: any = { context: {} };

  protected params: any;

  constructor(req: Request, resp: Response) {
    this.req = req;
    this.resp = resp;
    this.params = { ...req.body, ...req.params, ...req.query };
  }

  render(templateName: string) {
    if (!this.UIContext.title) this.setTitle(templateName);
    this.setUIContext('pageName', templateName);
    this.setUIContext('loggedUser', this.getSessionContext('loggedUser'));
    this.resp.render(templateName, this.UIContext);
  }

  setTitle(name: string) {
    this.UIContext.title = `${name} - 网上招聘系统`;
  }

  redirect(path: string) {
    this.resp.redirect(path);
  }

  setSessionContext(name: string, context: any) {
    // @ts-ignore
    this.req.session.context[name] = context;
  }

  setUIContext(name: string, context: any) {
    this.UIContext.context[name] = context;
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

export async function handle(req: Request, resp: Response, handlerClass: any) {
  try {
    const handler = new handlerClass(req, resp);
    const method: string = req.method.toLowerCase();
    if (handler.__requireAuth && !handler.getSessionContext('loggedUser'))
      throw new UnauthorizedError('你还没有登录！');
    if (handler[method]) await handler[method]();
    else throw new MethodNotAllowedError();
  } catch (error) {
    // @ts-ignore
    resp.status(error.status || 500);
    resp.render('error', { title: '错误', error });
  }
}
