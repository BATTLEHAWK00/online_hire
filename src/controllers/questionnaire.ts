import {Controller} from "../service/controller";
import questionnaireModel, {Questionnaire} from "../models/questionnaire";
import problemModel from "../models/problem";
import userModel from "../models/user";
import {RequestInvalidError} from "../service/error";
import questionnaire from "../models/questionnaire";

export class questionnaireController extends Controller {
    async get() {
        const qList = []
        for await (const q of await questionnaireModel.getQuestionnaireList()) {
            const {createBy, ...qDoc} = q
            if (!createBy) continue
            const user = await userModel.getUserByID(createBy)
            if (!user) continue
            qList.push({
                ...qDoc,
                createBy: user.userName
            })
        }
        this.setUIContext('qList', qList)
        this.setTitle('问卷')
        this.render('questionnaire_main')
    }
}

export class addQuestionnaireController extends Controller {
    async get() {
        const pList = []
        for (const {_id, name, desc, type} of await problemModel.getProblemList()) {
            pList.push({_id, name, desc, type})
        }
        this.setUIContext('pList', pList)
        this.setTitle('创建试卷')
        this.render('questionnaire_add')
    }

    async post() {
        let questionnaireDoc: Questionnaire = {
            name: this.params['name'],
            content: this.params['content']
        }
        questionnaireDoc.createBy = this.getSessionContext('loggedUser')._id
        await questionnaireModel.createQuestionnaire(questionnaireDoc)
        this.renderMessage('创建成功!')
    }
}

export class questionnaireDetailController extends Controller {
    async get() {
        const pList: any = []
        const q = await questionnaireModel.getByID(this.params['_id'])
        if (!q?.content) throw new RequestInvalidError()
        for await (const p of q.content) {
            pList.push(await problemModel.getByID(p))
        }
        const qDoc = {
            ...q,
            content: pList,
        }
        this.setUIContext('qDoc', qDoc)
        this.setTitle('试卷详情')
        this.render('questionnaire_detail')
    }
}