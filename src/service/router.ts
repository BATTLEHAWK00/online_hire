import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import path from 'path';
import { ControllerClass, handle } from './controller';
import loader from './loader';
import { fromSrc } from '../lib/pathUtil';
import { NoRouteFoundError } from './error';

const router = express.Router();
const routeMap: { [key: string]: string } = {};

export type ControllerInterceptor = (req: Request) => void;

function RegisterRoute(
  routeName: string,
  routePath: string,
  controller: ControllerClass,
  interceptors: ControllerInterceptor[] = [],
  preHandlers: RequestHandler[] = []
) {
  router.all(
    routePath,
    ...preHandlers,
    (req: Request, resp: Response, next: NextFunction) => {
      try {
        interceptors.forEach(i => i(req));
        handle(req, resp, next, controller);
      } catch (e) {
        next(e);
      }
    }
  );
  routeMap[routeName] = routePath;
}

function getRoute(routeName: string) {
  if (!(routeName in routeMap)) throw NoRouteFoundError(routeName);
  return routeMap[routeName];
}

const startTime = Date.now();
loader.loadModulesDir(path.join(fromSrc(), './controllers')).then(() => {
  console.log(
    `${Object.keys(routeMap).length} routes loaded. (${
      Date.now() - startTime
    }ms)`
  );
});

export default { router, RegisterRoute, getRoute };
