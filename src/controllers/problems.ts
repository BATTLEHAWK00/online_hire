import { Controller } from '../service/controller';
import problemModel, { Problem } from '../models/problem';
import { RequestInvalidError } from '../service/error';
import userModel from '../models/user';
import { RequireAuth } from '../service/controllerDecorators';

@RequireAuth()
export class problemsHandler extends Controller {
  async get() {
    const problemList = [];
    for await (const problem of await problemModel.getProblemList()) {
      const { createBy, ...pDoc } = problem;
      if (!createBy) continue;
      const user = await userModel.getUserByID(createBy);
      if (!user) continue;
      problemList.push({
        ...pDoc,
        createBy: user.userName,
      });
    }
    this.setUIContext('problemList', problemList);
    this.setTitle('题库');
    this.render('problems_main');
  }
}

export class problemsDetailController extends Controller {
  async get() {
    const pDoc = await problemModel.getByID(this.params['_id']);
    this.setUIContext('pDoc', pDoc);
    this.setTitle('题库');
    this.render('problems_detail');
  }
}

export class chooseProblemsTypeController extends Controller {
  async get() {
    this.setTitle('添加问题');
    this.render('problems_add_choosetype');
  }
}

export class addProblemsController extends Controller {
  async get() {
    this.setTitle('添加问题');
    switch (this.params['problemType']) {
      case 'singlechoice': {
        this.render('problems_add_singlechoice');
        break;
      }
      case 'multiplechoice': {
        this.render('problems_add_multiplechoice');
        break;
      }
      case 'shortanswer': {
        this.render('problems_add_shortanswer');
        break;
      }
      default:
        throw new RequestInvalidError();
    }
  }

  async post() {
    let problemDoc = null;
    switch (this.params['problemType']) {
      case 'singlechoice': {
        problemDoc = singleChoiceDoc(this.params);
        break;
      }
      case 'multiplechoice': {
        problemDoc = multipleChoiceDoc(this.params);
        break;
      }
      case 'shortanswer': {
        problemDoc = shortAnswerDoc(this.params);
        break;
      }
      default:
        throw new RequestInvalidError();
    }
    problemDoc.createBy = this.getSessionContext('loggedUser')._id;
    await problemModel.createProblem(problemDoc);
    this.renderMessage('添加成功!');
  }
}

export class deleteProblemController extends Controller {
  async post() {
    await problemModel.deleteProblem(this.params['_id']);
    this.renderMessage('删除成功!');
  }
}

function singleChoiceDoc(params: any): Problem {
  return {
    name: params['name'],
    desc: params['desc'],
    type: 'SingleChoice',
    content: {
      options: params['options'],
      answer: params['answer'],
    },
  };
}

function multipleChoiceDoc(params: any): Problem {
  return {
    name: params['name'],
    desc: params['desc'],
    type: 'MultipleChoice',
    content: {
      options: params['options'],
      answers: params['answers'],
    },
  };
}

function shortAnswerDoc(params: any): Problem {
  return {
    name: params['name'],
    desc: params['desc'],
    type: 'ShortAnswer',
    content: {
      answer: params['answer'],
    },
  };
}
