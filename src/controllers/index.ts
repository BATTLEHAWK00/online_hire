import { Controller } from '../service/controller';
import Router from '../service/router';

class indexController extends Controller {
  async get() {
    this.setTitle('首页');
    this.render('index');
    this.setValidator(this.get, {});
  }
}

class testController extends Controller {
  // async get() {}
}

Router.RegisterRoute('main', '/', indexController);
Router.RegisterRoute('test', '/test', testController);
