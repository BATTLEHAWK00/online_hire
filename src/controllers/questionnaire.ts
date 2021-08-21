import {Controller} from "../service/controller";

export class questionnaireController extends Controller {
    async get() {
        this.setTitle('问卷')
        this.render('questionnaire_main')
    }
}

export class addQuestionnaireController extends Controller{
    async get(){
        this.setTitle('创建问卷')
        this.render('questionnaire_add')
    }
    async post() {

    }
}