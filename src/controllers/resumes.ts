import {Controller} from "../service/controller";

export class resumesController extends Controller{
    async get() {
        this.setTitle('简历')
        this.render('resumes_main')
    }
}