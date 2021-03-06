import { Controller } from '../service/controller';
import Router from '../service/router';

import userModel, { User } from '../models/user';
import {
  LoginInvalidError,
  UnauthorizedError,
  UserAlreadyExistsError,
  UserNotExistError,
  ValidationError,
} from '../service/error';
import { sha1 } from '../lib/crypto';
import {
  CanBeEmpty,
  isChineseName,
  isEmail,
  isGender,
  isName,
  isPassword,
  isPhone,
  isUname,
} from '../lib/validators';
import { loginChecker } from '../service/interceptors/LoginChecker';

export class loginController extends Controller {
  async get() {
    if (this.getSessionContext('loggedUser')) {
      this.redirect('/');
      return;
    }
    this.setTitle('登录');
    this.render('user_login');
  }

  async post() {
    const user = await userModel.getUserByUname(this.params.userName);
    if (user) {
      const { cipher } = sha1(this.params.passwd, user.salt);
      if (cipher !== user.passwd) throw LoginInvalidError();
      delete user.passwd;
      delete user.salt;
      this.setSessionContext('loggedUser', user);
      this.renderMessage('您已登录成功!');
    } else throw LoginInvalidError();
  }

  protected onInit() {
    this.setValidator(this.post, {
      userName: isUname,
      passwd: isPassword,
    });
  }
}

export class registerController extends Controller {
  async get() {
    this.setTitle('注册');
    this.render('user_register');
  }

  async post() {
    if (await userModel.getUserByUname(this.params.userName))
      throw UserAlreadyExistsError();
    if (this.params.confirmPasswd !== this.params.passwd)
      throw ValidationError('输入密码不一致！')();
    const user: User = {
      userName: this.params.userName,
      realName: this.params.realName,
      phone: this.params.phone,
      email: this.params.email,
      role: 'applicant',
    };
    const digest = sha1(this.params.passwd);
    user.passwd = digest.cipher;
    user.salt = digest.salt;
    await userModel.createUser(user);
    this.renderMessage('注册成功!', '/login');
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

export class logoutController extends Controller {
  async get() {
    this.setSessionContext('loggedUser', null);
    this.renderMessage('已注销用户!', '/');
  }
}

export class userDetailController extends Controller {
  async get() {
    const user = await userModel.getUserByID(this.params.uid);
    if (user) {
      delete user.passwd;
      this.setTitle(user.userName || 'null');
      this.setUIContext('udoc', user);
      this.render('user_detail');
    } else throw UserNotExistError();
  }

  async post() {
    const loggedUser = this.getSessionContext('loggedUser');
    if (!loggedUser || (loggedUser && loggedUser._id !== this.params.uid))
      throw UnauthorizedError();
    if (this.getParam('passwd') !== this.getParam('confirmPasswd'))
      throw new Error();
    const user: any = {
      userName: this.getParam('userName'),
      realName: this.getParam('realName'),
      gender: this.getParam('gender'),
      phone: this.getParam('phone'),
      email: this.getParam('email'),
      desc: this.getParam('desc'),
    };
    if (this.getParam('passwd')) {
      const digest = sha1(this.getParam('passwd'));
      user.salt = digest.salt;
      user.passwd = digest.cipher;
    }
    const $set: any = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const userKey in user) {
      if (user[userKey]) $set[userKey] = user[userKey];
    }
    await userModel.updateUser(this.getParam('uid'), $set);
    this.renderMessage('信息修改成功!');
  }

  protected onInit() {
    this.setValidator(this.post, {
      userName: isName,
      realName: isChineseName,
      phone: isPhone,
      email: isEmail,
      desc: CanBeEmpty(isName),
      gender: isGender,
      passwd: CanBeEmpty(isPassword),
      confirmPasswd: CanBeEmpty(isPassword),
    });
  }
}

Router.RegisterRoute('user_login', '/login', loginController);
Router.RegisterRoute('user_register', '/register', registerController);
Router.RegisterRoute('user_logout', '/logout', logoutController, [
  loginChecker,
]);
Router.RegisterRoute('user_detail', '/user/:uid', userDetailController, [
  loginChecker,
]);
