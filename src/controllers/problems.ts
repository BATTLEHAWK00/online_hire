import {Controller} from "../service/controller";
import problemModel from "../models/problem";

export class problemsHandler extends Controller {
    async get() {
        this.setUIContext('problemList', await problemModel.getProblemList())
        this.setTitle('题库')
        this.render('problems_main')
    }
}

export class addProblemsController extends Controller {
    async get() {
        this.setTitle('添加问题')
        this.render('problems_add')
    }

    async post() {

    }
}