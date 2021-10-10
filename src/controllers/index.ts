import { Controller } from '../service/controller';

export class indexController extends Controller {
  async get() {
    this.setTitle('首页');
    this.render('index');
    this.setValidator(this.get, {});
  }
}

export class testController extends Controller {
  // async get() {}
}
