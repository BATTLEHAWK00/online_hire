const userModel = require('../models/user')

async function loginHandler(req, resp) {
    if (req.method === 'GET') {
        resp.render('login', {title: '用户登录'})
        return
    }
    const user = await userModel.getUserByUname(req.body['userName'])
    if (user && user['passwd'] === req.body['passwd']) {
        delete user['passwd']
        req.session.context['loggedUser'] = user
    } else {
        resp.redirect('/error')
    }
    resp.redirect('/')
}

async function registerHandler(req, resp) {
    if (req.method === 'GET') {
        resp.render('register', {title: '用户注册'})
        return
    }
    const params = req.body
    console.log(params)
    if (params['confirmPasswd'] !== params['passwd']) throw new Error()
    const user = {
        userName: params['userName'],
        passwd: params['passwd'],
        realName: params['realName'],
        phone: params['phone'],
        role: 'applicant'
    }
    const res = await userModel.createUser(user)
    resp.redirect('/')
}

module.exports = {
    loginHandler,
    registerHandler
}