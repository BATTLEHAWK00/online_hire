import { NextFunction, Request, Response } from 'express';
import {
  MethodNotAllowedError,
  UnauthorizedError,
  ValidationError,
} from './error';

export interface ControllerMethods {
  get(): void;

  post(): void;

  put(): void;

  delete(): void;
}

interface Function {
  name: string;
}

declare module 'express-session' {
  interface SessionData {
    context: any;
  }
}

function trimParams(data: any) {
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Object) trimParams(data[key]);
    if (typeof data[key] === 'string') data[key] = data[key].trim();
  });
}

export abstract class Controller {
  protected req: Request;
  protected resp: Response;
  private UIContext: any = {};
  protected params: any;
  private validators: any = {};
  private __handleTime: number;
  private __renderTime: number | undefined;

  constructor(req: Request, resp: Response) {
    this.__handleTime = Date.now();
    this.req = req;
    this.resp = resp;
    this.params = { ...req.body, ...req.params, ...req.query };
    trimParams(this.params);
    if (this.onInit) this.onInit();
  }

  protected render(templateName: string) {
    this.__renderTime = Date.now();
    if (this.req.get('X-PJAX')) {
      this.setUIContext('usePjax', true);
      console.log('pjax');
    }
    if (!this.UIContext.pageTitle) this.setTitle(templateName);
    this.setUIContext('pageName', templateName);
    this.setUIContext('loggedUser', this.getSessionContext('loggedUser'));
    this.resp.render(templateName, {
      ...this.UIContext,
      UIContext: this.UIContext,
      handler: this,
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected setValidator(method: Function, validators: any) {
    this.validators[method.name] = validators;
  }

  public getValidator(methodName: string) {
    return this.validators[methodName];
  }

  public getParam(name: string) {
    return this.params[name];
  }

  protected setTitle(name: string) {
    this.setUIContext('pageTitle', `${name} - 网上招聘系统`);
  }

  protected redirect(path: string) {
    this.resp.redirect(path);
  }

  protected setSessionContext(name: string, context: any) {
    this.req.session.context[name] = context;
  }

  protected setUIContext(name: string, context: any) {
    this.UIContext[name] = context;
  }

  public getSessionContext(name: string) {
    return this.req.session.context[name];
  }

  protected renderMessage(msg: string, redirectPath?: string, title = '消息') {
    this.setTitle(title);
    this.setUIContext('title', title);
    this.setUIContext('msg', msg);
    const redirectTo = redirectPath || this.req.header('referer');
    this.setUIContext('referer', redirectTo);
    this.resp.setHeader('refresh', `3;url=${redirectTo}`);
    this.render('message');
  }

  protected onInit?(): void;
}

// eslint-disable-next-line no-unused-vars
export type ControllerClass = new (...args: any[]) => Controller;

function validateParams(validators: any, params: any) {
  Object.keys(validators)
    .filter(key => key in params)
    .map(key => ({ name: key, result: validators[key](params[key]) }))
    .forEach(res => {
      if (res.result === false)
        throw ValidationError(`校验错误：${res.name}`)();
      else if (typeof res.result === 'string')
        throw ValidationError(`校验错误：${res.name}, ${res.result}`)();
    });
}

export async function handle(
  req: Request,
  resp: Response,
  next: NextFunction,
  HandlerClass: any
) {
  try {
    // 生成Handler
    const handler = new HandlerClass(req, resp);

    // 获取HTTP方法
    const method: string = req.method.toLowerCase();

    // 登录验证
    if (handler.__requireAuth && !handler.getSessionContext('loggedUser'))
      throw UnauthorizedError('你还没有登录！');

    // 校验参数
    if (handler.getValidator(method))
      validateParams(handler.getValidator(method), handler.params);

    // 处理请求
    if (handler[method]) await handler[method]();
    // 处理无法响应的请求
    else throw MethodNotAllowedError();
  } catch (error) {
    next(error);
  }
}
