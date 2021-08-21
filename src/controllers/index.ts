import {Controller} from "../service/controller";

export class indexController extends Controller {
    async get() {
        this.setTitle('首页')
        this.render('index')
    }
}
