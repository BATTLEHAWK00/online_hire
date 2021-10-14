import express, { RequestHandler } from 'express';
import path from 'path';
import loader from './loader';
import { fromSrc } from '../lib/pathUtil';
import { ControllerClass, handle } from './controller';

const router = express.Router();

function RegisterRoute(
  reqPath: string,
  controller: ControllerClass,
  preHandlers: RequestHandler[] = []
) {
  router.all(reqPath, ...preHandlers, (req, resp) =>
    handle(req, resp, controller)
  );
}


//

//

//

//
// router.all('/test', (req, resp) => handle(req, resp, testController));
loader.loadModulesDir(path.join(fromSrc(), './controllers'));

export default { router, RegisterRoute };
