import { ValidationError } from './error';
import { Validator } from '../lib/validators';

export function trimParams(data: any) {
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Object) trimParams(data[key]);
    if (typeof data[key] === 'string') data[key] = data[key].trim();
  });
}

export function validateParams(validators: any, params: any) {
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

export function validateSingle(
  validator: Validator,
  param: any,
  paramName = ''
) {
  const res = validator(param);
  if (res === false) throw ValidationError(`校验错误：${paramName}`)();
  else if (typeof res === 'string')
    throw ValidationError(`校验错误：${paramName}, ${res}`)();
}
