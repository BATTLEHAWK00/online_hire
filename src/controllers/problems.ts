import {Controller} from "../service/controller";
import problemModel from "../models/problem";
import { RequestInvalidError } from "../service/error";

export class problemsHandler extends Controller {
    async get() {
        this.setUIContext('problemList', await problemModel.getProblemList())
        this.setTitle('题库')
        this.render('problems_main')
    }
}

export class chooseProblemsTypeController extends Controller {
    async get() {
        this.setTitle('添加问题')
        this.render('problems_add_choosetype')
    }
}

export class addProblemsController extends Controller {
    async get() {
        this.setTitle('添加问题')
        switch (this.params['problemType']) {
            case 'singlechoice': {
                this.render('problems_add_singlechoice')
                break
            }
            case 'multiplechoice': {
                this.render('problems_add_multiplechoice')
                break
            }
            case 'shortanswer': {
                this.render('problems_add_shortanswer')
                break
            }
            default:
                throw new RequestInvalidError()
        }
    }
    async post() {

    }
}