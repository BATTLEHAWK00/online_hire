import { Request } from 'express';
import { UnauthorizedError } from '../error';
import { RoleType } from '../../models/user';

// eslint-disable-next-line import/prefer-default-export
export function RoleChecker(...role: RoleType[]) {
  return (req: Request) => {
    if (!req.session.context.loggedUser) throw UnauthorizedError();
    if (role.indexOf(req.session.context.loggedUser.role) === -1)
      throw UnauthorizedError();
  };
}
