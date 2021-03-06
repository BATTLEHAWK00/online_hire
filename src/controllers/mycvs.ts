import crypto from 'crypto';
import path from 'path';
import { Controller } from '../service/controller';
import resumesModel, { Resume } from '../models/resume';
import { RequestInvalidError, UnauthorizedError } from '../service/error';
import { storageService } from '../service/fileStorage';
import positionModel from '../models/position';
import Router from '../service/router';
import multipart from '../service/middlewares/multipart';
import { loginChecker } from '../service/interceptors/LoginChecker';
import { RoleChecker } from '../service/interceptors/RoleChecker';
import userModel from '../models/user';

export class mycvsController extends Controller {
  async get() {
    const rList: any = await resumesModel.getResumesByUID(
      this.getSessionContext('loggedUser')._id
    );
    await Promise.all(
      Object.keys(rList).map(async key => {
        rList[key].intention = await positionModel.getPositionByID(
          rList[key].intention
        );
      })
    );
    this.setUIContext('rList', rList);
    this.setTitle('我的投递');
    this.render('mycvs_main');
  }
}

export class mycvsDetailController extends Controller {
  async get() {
    const rDoc = await resumesModel.getResumeByID(this.getParam('_id'));
    const loggedUser = this.getSessionContext('loggedUser');
    if (loggedUser._id !== rDoc?.uid && loggedUser.role === 'applicant')
      throw UnauthorizedError();
    const [iDoc, uDoc] = await Promise.all([
      positionModel.getPositionByID(<string>rDoc?.intention),
      userModel.getUserByID(<string>rDoc?.uid),
    ]);
    this.setUIContext('rDoc', rDoc);
    this.setUIContext('uDoc', uDoc);
    this.setUIContext('iDoc', iDoc);
    this.setTitle('简历投递');
    this.render('mycvs_detail');
  }
}

export class mycvsUploadController extends Controller {
  async get() {
    const pList = await positionModel.getPositionList();
    this.setUIContext('pList', pList);
    this.setTitle('投递简历');
    this.render('mycvs_upload');
  }

  async post() {
    if (!this.req.file) throw RequestInvalidError();
    const fileMD5 = crypto
      .createHash('md5')
      .update(this.req.file.buffer)
      .digest('hex')
      .toString();
    const fileExt = path.extname(this.req.file.originalname);
    const objName = `${
      this.getSessionContext('loggedUser')._id
    }/${fileMD5}${fileExt}`;
    await storageService.put('resumeFiles', objName, this.req.file.buffer);
    const rDoc: Resume = {
      uid: this.getSessionContext('loggedUser')._id,
      intention: this.params.intention,
      desc: this.params.desc,
      status: 'New',
      resumeFiles: [
        {
          filePath: objName,
          contentType: this.req.file.mimetype,
          size: this.req.file.size,
        },
      ],
    };
    await resumesModel.createResume(rDoc);
    this.renderMessage('投递成功!');
  }
}

Router.RegisterRoute('mycvs', '/mycvs', mycvsController, [
  loginChecker,
  RoleChecker('admin', 'applicant'),
]);
Router.RegisterRoute(
  'mycvs_send',
  '/mycvs/send',
  mycvsUploadController,
  [loginChecker, RoleChecker('admin', 'applicant')],
  [multipart.single('resumePDF')]
);
Router.RegisterRoute(
  'mycvs_detail',
  '/mycvs/detail/:_id',
  mycvsDetailController,
  [loginChecker]
);
