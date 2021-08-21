import {Controller} from "../service/controller";

import userModel from '../models/user';
import {LoginInvalidError} from "../service/error";

export class loginController extends Controller {
    async get() {
        this.setTitle("登录")
        this.render("login")
    }

    async post() {
        const user = await userModel.getUserByUname(this.params['userName'])
        if (user && user['passwd'] === this.params['passwd']) {
            delete user['passwd']
            this.setSessionContext('loggedUser', user)
        } else {
            console.log(this.params)
            throw new LoginInvalidError()
        }
        this.redirect('/')
    }
}

export class registerController extends Controller {
    async get() {
        this.setTitle("注册")
        this.render("register")
    }

    async post() {
        if (this.params['confirmPasswd'] !== this.params['passwd']) throw new Error()
        const user = {
            userName: this.params['userName'],
            passwd: this.params['passwd'],
            realName: this.params['realName'],
            phone: this.params['phone'],
            role: 'applicant'
        }
        const res = await userModel.createUser(user)
        this.redirect('/')
    }
}

