import { Controller } from '../service/controller';
import Router from '../service/router';
import { RoleChecker } from '../service/interceptors/RoleChecker';
import {
  isChineseName,
  isEmail,
  isPassword,
  isPhone,
  isUname,
} from '../lib/validators';
import userModel, { User } from '../models/user';
import { UserAlreadyExistsError, ValidationError } from '../service/error';
import { sha1 } from '../lib/crypto';

class systemManageController extends Controller {
  async get() {
    this.setTitle('系统管理');
    this.render('system_main');
  }
}

class systemRegisterController extends Controller {
  async get() {
    this.setTitle('用户注册');
    this.render('system_register');
  }

  async post() {
    if (await userModel.getUserByUname(this.params.userName))
      throw UserAlreadyExistsError();
    if (this.params.confirmPasswd !== this.params.passwd)
      throw ValidationError('输入密码不一致！')();
    const user: User = {
      userName: this.getParam('userName'),
      realName: this.getParam('realName'),
      phone: this.getParam('phone'),
      email: this.getParam('email'),
      role: this.getParam('role'),
    };
    const digest = sha1(this.params.passwd);
    user.passwd = digest.cipher;
    user.salt = digest.salt;
    await userModel.createUser(user);
    this.renderMessage('注册成功!');
  }

  protected onInit() {
    this.setValidator(this.post, {
      userName: isUname,
      realName: isChineseName,
      phone: isPhone,
      email: isEmail,
      passwd: isPassword,
    });
  }
}

Router.RegisterRoute('system_main', '/manage', systemManageController, [
  RoleChecker('admin'),
]);
Router.RegisterRoute(
  'system_main',
  '/manage/register',
  systemRegisterController,
  [RoleChecker('admin')]
);
