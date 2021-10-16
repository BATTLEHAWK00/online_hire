import { Controller } from '../service/controller';
import positionModel from '../models/position';
import { PositionAlreadyExistsError } from '../service/error';
import { RequireAuth } from '../service/controllerDecorators';
import Router from '../service/router';

@RequireAuth()
export class positionsController extends Controller {
  async get() {
    this.setTitle('职位');
    this.setUIContext('pList', await positionModel.getPositionList());
    this.render('positions_main');
  }
}

@RequireAuth()
export class addPositionsController extends Controller {
  async get() {
    this.setTitle('添加职位');
    this.render('positions_add');
  }

  async post() {
    if (await positionModel.getPositionByName(this.params.name))
      throw PositionAlreadyExistsError();
    const position: any = {
      name: this.params.name,
    };
    await positionModel.addPosition(position);
    this.renderMessage('添加成功!', '/positions');
  }
}

@RequireAuth()
export class deletePositionController extends Controller {
  async post() {
    await positionModel.deletePosition(this.params._id);
    this.renderMessage('删除成功!', '/positions');
  }
}

Router.RegisterRoute('positions_main', '/positions', positionsController);
Router.RegisterRoute('positions_add', '/positions/add', addPositionsController);
Router.RegisterRoute(
  'positions_delete',
  '/positions/delete/:_id',
  deletePositionController
);
