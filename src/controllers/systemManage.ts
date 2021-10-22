import { Controller } from '../service/controller';
import Router from '../service/router';
import { RoleChecker } from '../service/interceptors/RoleChecker';

class systemManageController extends Controller {
  async get() {
    this.render('system_main');
  }
}

Router.RegisterRoute('system_main', '/manage', systemManageController, [
  RoleChecker('admin'),
]);
