import { Controller } from '../service/controller';
import problemModel, { Problem } from '../models/problem';
import { ProblemInvalidError, RequestInvalidError } from '../service/error';
import userModel from '../models/user';
import Router from '../service/router';
import { loginChecker } from '../service/interceptors/LoginChecker';
import { validateSingle } from '../service/validation';
import { isName } from '../lib/validators';
import { RoleChecker } from '../service/interceptors/RoleChecker';
import { listToObject } from '../lib/jsUtils';

function singleChoiceDoc(params: any): Problem {
  const options = Object.keys(params.options).map(option => ({
    name: params.options[option],
    isAnswer: false,
  }));
  options[params.answer].isAnswer = true;
  if (new Set(options.map(({ name }) => name)).size !== options.length)
    throw ProblemInvalidError();
  return {
    name: params.name,
    desc: params.desc,
    type: 'SingleChoice',
    content: {
      options,
    },
  };
}

function multipleChoiceDoc(params: any): Problem {
  console.log(params);
  const options = Object.keys(params.options).map(option => ({
    name: params.options[option],
    isAnswer: params[`answer.${option}`] === 'on',
  }));
  if (new Set(options.map(({ name }) => name)).size !== options.length)
    throw ProblemInvalidError();
  if (options.filter(({ isAnswer }) => isAnswer).length < 2)
    throw ProblemInvalidError();
  return {
    name: params.name,
    desc: params.desc,
    type: 'MultipleChoice',
    content: {
      options,
    },
  };
}

function shortAnswerDoc(params: any): Problem {
  return {
    name: params.name,
    desc: params.desc,
    type: 'ShortAnswer',
    content: {
      answer: params.answer,
    },
  };
}

export class problemsHandler extends Controller {
  async get() {
    const pdocs = await problemModel.getProblemList();
    const uDict = listToObject(
      await Promise.all(
        pdocs.map(async ({ createBy }) =>
          userModel.getUserByID(<string>createBy)
        )
      ),
      '_id'
    );
    this.setUIContext('pDocs', pdocs);
    this.setUIContext('uDict', uDict);
    this.setTitle('题库');
    this.render('problems_main');
  }
}

export class problemsDetailController extends Controller {
  async get() {
    const pDoc = await problemModel.getByID(this.getParam('_id'));
    const uDoc = await userModel.getUserByID(<string>pDoc?.createBy);
    this.setUIContext('pDoc', pDoc);
    this.setUIContext('uDoc', uDoc);
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
    switch (this.getParam('problemType')) {
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
        throw RequestInvalidError();
    }
  }

  async post() {
    let problemDoc = null;
    console.log(this.params);
    validateSingle(isName, this.getParam('name'));
    validateSingle(isName, this.getParam('desc'));
    if (await problemModel.getByName(this.getParam('name')))
      throw RequestInvalidError('该题目名称已存在！');
    switch (this.getParam('problemType')) {
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
        throw RequestInvalidError();
    }
    problemDoc.createBy = this.getSessionContext('loggedUser')._id;
    await problemModel.createProblem(problemDoc);
    this.renderMessage('添加成功!');
  }
}

export class deleteProblemController extends Controller {
  async post() {
    await problemModel.deleteProblem(this.params._id);
    this.renderMessage('删除成功!');
  }
}

Router.RegisterRoute('problems_main', '/problems', problemsHandler, [
  loginChecker,
  RoleChecker('admin', 'manager'),
]);
Router.RegisterRoute(
  'problems_detail',
  '/problems/detail/:_id',
  problemsDetailController,
  [loginChecker, RoleChecker('admin', 'manager')]
);
Router.RegisterRoute(
  'problems_choosetype',
  '/problems/add',
  chooseProblemsTypeController,
  [loginChecker, RoleChecker('admin', 'manager')]
);
Router.RegisterRoute(
  'problems_add',
  '/problems/add/:problemType',
  addProblemsController,
  [loginChecker, RoleChecker('admin', 'manager')]
);
Router.RegisterRoute(
  'problems_delete',
  '/problems/delete/:_id',
  deleteProblemController,
  [loginChecker, RoleChecker('admin', 'manager')]
);
