import { Controller } from '../service/controller';
import positionModel, { Position } from '../models/position';
import { PositionAlreadyExistsError } from '../service/error';
import Router from '../service/router';
import { loginChecker } from '../service/interceptors/LoginChecker';
import { isName } from '../lib/validators';
import { RoleChecker } from '../service/interceptors/RoleChecker';
import userModel from '../models/user';
import { listToObject } from '../lib/jsUtils';

export class positionsController extends Controller {
  async get() {
    const pdocs: Position[] = await positionModel.getPositionList();
    const udocs: any[] = await Promise.all(
      pdocs
        .filter(({ createBy }) => typeof createBy === 'string')
        .map(async ({ createBy }) => userModel.getUserByID(<string>createBy))
    );
    const uDict: any = listToObject(udocs, '_id');
    this.setTitle('职位');
    this.setUIContext('pList', pdocs);
    this.setUIContext('uDict', uDict);
    this.render('positions_main');
  }
}

export class addPositionsController extends Controller {
  async get() {
    this.setTitle('添加职位');
    this.render('positions_add');
  }

  async post() {
    if (await positionModel.getPositionByName(this.getParam('name')))
      throw PositionAlreadyExistsError();
    const position: Position = {
      name: this.getParam('name'),
      desc: this.getParam('desc'),
      createBy: this.getSessionContext('loggedUser')._id,
    };
    await positionModel.addPosition(position);
    this.renderMessage('添加成功!', '/positions');
  }

  protected onInit() {
    this.setValidator(this.post, {
      name: isName,
    });
  }
}

export class deletePositionController extends Controller {
  async post() {
    await positionModel.deletePosition(this.getParam('_id'));
    this.renderMessage('删除成功!', '/positions');
  }
}

Router.RegisterRoute('positions_main', '/positions', positionsController, [
  loginChecker,
  RoleChecker('admin', 'manager'),
]);
Router.RegisterRoute(
  'positions_add',
  '/positions/add',
  addPositionsController,
  [loginChecker, RoleChecker('admin', 'manager')]
);
Router.RegisterRoute(
  'positions_delete',
  '/positions/delete/:_id',
  deletePositionController,
  [loginChecker, RoleChecker('admin', 'manager')]
);
