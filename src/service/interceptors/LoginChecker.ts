import { Request } from 'express';
import { UnauthorizedError } from '../error';

// eslint-disable-next-line import/prefer-default-export
export function loginChecker(req: Request) {
  if (!req.session.context.loggedUser) throw UnauthorizedError();
}
