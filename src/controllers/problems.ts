import {Controller} from "../service/controller";

export class problemsHandler extends Controller{
    async get() {
        this.setTitle('题库')
        this.render('problems_main')
    }
}