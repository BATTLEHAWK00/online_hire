import {Controller} from "../service/controller";

import userModel, {User} from '../models/user';
import {LoginInvalidError, UnauthorizedError, UserAlreadyExistsError, UserNotExistError} from "../service/error";

export class loginController extends Controller {
    async get() {
        if (this.getSessionContext('loggedUser')) {
            this.redirect('/')
            return
        }
        this.setTitle("登录")
        this.render("user_login")
    }

    async post() {
        const user = await userModel.getUserByUname(this.params['userName'])
        if (user && user['passwd'] === this.params['passwd']) {
            delete user['passwd']
            this.setSessionContext('loggedUser', user)
            this.renderMessage('您已登录成功!')
        } else throw new LoginInvalidError()
    }
}

export class registerController extends Controller {
    async get() {
        this.setTitle("注册")
        this.render("user_register")
    }

    async post() {
        if (await userModel.getUserByUname(this.params['userName'])) throw new UserAlreadyExistsError()
        if (this.params['confirmPasswd'] !== this.params['passwd']) throw new Error()
        const user: User = {
            userName: this.params['userName'],
            passwd: this.params['passwd'],
            realName: this.params['realName'],
            phone: this.params['phone'],
            email: this.params['email'],
            role: 'applicant'
        }
        await userModel.createUser(user)
        this.renderMessage('注册成功!')
    }
}

export class logoutController extends Controller {
    async get() {
        this.setSessionContext('loggedUser', null)
        this.renderMessage('已注销用户!')
    }
}

export class userDetailController extends Controller {
    async get() {
        const loggedUser = this.getSessionContext('loggedUser')
        if (!loggedUser || (loggedUser && loggedUser['_id'] !== this.params['uid']))
            throw new UnauthorizedError()
        const user = await userModel.getUserByID(this.params['uid'])
        if (user) {
            delete user['passwd']
            this.setTitle(user.userName || 'null')
            this.setUIContext('udoc', user)
            this.render('user_detail')
        } else throw new UserNotExistError()
    }

    async post() {
        if (this.params['passwd'] !== this.params['confirmPasswd'])
            throw new Error()
        const user: any = {
            userName: this.params['userName'],
            realName: this.params['realName'],
            gender: this.params['gender'],
            phone: this.params['phone'],
            email: this.params['email'],
            desc: this.params['desc'],
        }
        const $set: any = {}
        for (const userKey in user) {
            if (user[userKey] !== undefined) $set[userKey] = user[userKey]
        }
        await userModel.updateUser(this.params['uid'], $set)
        this.renderMessage('信息修改成功!')
    }
}