interface IControllerError {
    new(...args: any[]): ControllerError
}

class ControllerError extends Error {

    constructor(message?: string) {
        super(message);
    }
}

function Err(ErrorClass: IControllerError, message?: string, status?: number) {
    const controllerError: IControllerError = class extends ErrorClass {
    }
    controllerError.prototype.message = message
    controllerError.prototype.status = status
    return controllerError
}

export const MethodNotAllowedError = Err(ControllerError, 'The method you requested is not allowed', 405)
export const NotFoundError = Err(ControllerError, 'Not found', 404)

export const LoginInvalidError = Err(ControllerError, '登录失败!请检查用户名和密码.', 400)
export const UserAlreadyExistsError = Err(ControllerError, '用户已存在!请检查用户名.', 400)
export const UserNotExistError = Err(ControllerError, '该用户不存在!', 404)
export const UnauthorizedError = Err(ControllerError, '您无权限进行此操作!', 403)
export const PositionAlreadyExistsError = Err(ControllerError, '该职位已存在!', 400)
