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
export const LoginInvalidError = Err(ControllerError, '登录失败!请检查用户名和密码.', 400)
