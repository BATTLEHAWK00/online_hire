import { Controller } from '../service/controller';
import Router from '../service/router';

class indexController extends Controller {
  async get() {
    this.setTitle('首页');
    this.render('index');
  }
}

Router.RegisterRoute('main', '/', indexController);
