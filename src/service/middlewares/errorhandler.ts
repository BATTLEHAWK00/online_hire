import { NextFunction, Request, Response } from 'express';

export const errorHandleMiddleware = function (
  err: any,
  req: Request,
  res: Response
  // next: NextFunction
) {
  if (req.app.get('env') === 'development') {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
  }
  console.error(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
};
