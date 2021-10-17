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

// eslint-disable-next-line no-unused-vars
type ControllerInterceptor = (req: Request) => void;

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

console.log('registering routes...');
loader.loadModulesDir(path.join(fromSrc(), './controllers')).then(() => {
  console.log(`${Object.keys(routeMap).length} routes loaded.`);
});

export default { router, RegisterRoute, getRoute };
