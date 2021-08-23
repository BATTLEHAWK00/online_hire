import {Controller} from "../service/controller";

export class mycvsController extends Controller {
    async get() {
        this.setTitle('我的投递')
        this.render('my_cvs')
    }
}
