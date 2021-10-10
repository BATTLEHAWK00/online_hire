export class ControllerError extends Error {
  constructor(private msg?: string, private status: number = 400) {
    super(msg);
  }

  public getStatus() {
    return this.status;
  }

  public getMessage() {
    return this.msg;
  }
}

function ControllerErr(message?: string, status = 400) {
  const ErrorClass: new (
    ...args: any[]
  ) => ControllerError = class extends ControllerError {};
  return (...args: any[]) => new ErrorClass(message, status, ...args);
}

export const MethodNotAllowedError = ControllerErr(
  'The method you requested is not allowed',
  405
);
export const NotFoundError = ControllerErr('Not found', 404);

export const RequestInvalidError = ControllerErr('请求错误.', 400);
export const LoginInvalidError = ControllerErr(
  '登录失败!请检查用户名和密码.',
  400
);
export const UserAlreadyExistsError = ControllerErr(
  '用户已存在!请检查用户名.',
  400
);
export const UserNotExistError = ControllerErr('该用户不存在!', 404);
export const UnauthorizedError = ControllerErr('您无权限进行此操作!', 403);
export const PositionAlreadyExistsError = ControllerErr('该职位已存在!', 400);
export const EmptyResponseError = ControllerErr('响应为空!', 500);
export const ValidationError = (msg: string) => ControllerErr(msg, 400);
