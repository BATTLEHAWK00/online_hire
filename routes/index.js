var express = require('express');
var router = express.Router();
const user = require("../controllers/user");
const {ne} = require("nunjucks/src/tests");

/* GET home page. */
router.get('/', async function (req, res, next) {
    res.render('index', {title: '首页', context: req.session.context});
});
router.get('/resumes', function (req, res, next) {
    res.render('resumes_main',
        {
            title: 'Express',
            resdoc: [
                {
                    userName: 'yxl',
                    intention: 'Java开发岗',
                    marks: 90,
                    submitTime: '123123'
                },
                {
                    userName: 'yxl',
                    intention: 'Java开发岗',
                    marks: 90,
                    submitTime: '123123'
                },
                {
                    userName: 'yxl',
                    intention: 'Java开发岗',
                    marks: 90,
                    submitTime: '123123'
                }
            ]
        });
});
router.get('/problems', function (req, res, next) {
    res.render('problems_main', {title: 'Express'});
});
router.get('/positions', function (req, res, next) {
    res.render('positions_main', {title: 'Express'});
});
router.get('/questionnaires', function (req, res, next) {
    res.render('questionnaire_main', {title: 'Express'});
});
router.get('/positions/add', function (req, res, next) {
    res.render('positions_add', {title: 'Express'});
});
router.get('/questionnaires/add', function (req, res, next) {
    res.render('questionnaire_add', {title: 'Express'});
});
router.get('/problems/add', function (req, res, next) {
    res.render('problems_add', {title: 'Express'});
});
router.all('/login', user.loginHandler);
router.all('/register', user.registerHandler);

module.exports = router;
