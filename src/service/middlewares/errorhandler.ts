import { NextFunction, Request, Response } from 'express';
import { ControllerError } from '../error';

// eslint-disable-next-line import/prefer-default-export
export function errorHandleMiddleware(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) {
  if (err instanceof ControllerError) console.error(err.message);
  if ('status' in err && err.status !== 404) console.error(err);
  // render the error page
  res.status('status' in err ? err.status : 500);
  res.render('error', { pageTitle: '错误', pageName: 'error', error: err });
}
