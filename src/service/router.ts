import express, { RequestHandler } from 'express';
import path from 'path';
import { ControllerClass, handle } from './controller';
import loader from './loader';
import { fromSrc } from '../lib/pathUtil';

const router = express.Router();

function RegisterRoute(
  reqPath: string,
  controller: ControllerClass,
  preHandlers: RequestHandler[] = []
) {
  router.all(reqPath, ...preHandlers, (req, resp, next) =>
    handle(req, resp, next, controller)
  );
}

loader.loadModulesDir(path.join(fromSrc(), './controllers'));

export default { router, RegisterRoute };
