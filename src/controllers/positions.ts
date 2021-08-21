import {Controller} from "../service/controller";

export class positionsController extends Controller{
    async get() {
        this.setTitle('职位')
        this.render('positions_main')
    }
}