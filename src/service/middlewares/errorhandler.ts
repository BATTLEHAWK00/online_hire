import { Request, Response } from 'express';

// eslint-disable-next-line import/prefer-default-export
export function errorHandleMiddleware(
  err: { message: any; status: number },
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
  res.status('status' in err ? err.status : 500);
  res.render('error');
}
