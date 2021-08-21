import {Controller} from "../service/controller";

export class questionnaireController extends Controller {
    async get() {
        this.setTitle('问卷')
        this.render('questionnaire_main')
    }
}