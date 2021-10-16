import express, { RequestHandler } from 'express';
import path from 'path';
import { ControllerClass, handle } from './controller';
import loader from './loader';
import { fromSrc } from '../lib/pathUtil';
import { NoRouteFoundError } from './error';

const router = express.Router();
const routeMap: { [key: string]: string } = {};

function RegisterRoute(
  routeName: string,
  routePath: string,
  controller: ControllerClass,
  preHandlers: RequestHandler[] = []
) {
  router.all(routePath, ...preHandlers, (req, resp, next) =>
    handle(req, resp, next, controller)
  );
  routeMap[routeName] = routePath;
}

function getRoute(routeName: string) {
  if (!(routeName in routeMap)) throw NoRouteFoundError(routeName);
  return routeMap[routeName];
}

console.log('registering routes...');
loader.loadModulesDir(path.join(fromSrc(), './controllers')).then(() => {
  console.log(`routes loaded: ${JSON.stringify(Object.keys(routeMap))}`);
});

export default { router, RegisterRoute, getRoute };
