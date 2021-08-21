import express from 'express';

const router = express.Router();
import {handle} from "../service/controller";
import {loginController, logoutController, registerController} from '../controllers/user'
import {indexController} from "../controllers/index";
import {addProblemsController, problemsHandler} from "../controllers/problems";
import {addPositionsController, positionsController} from "../controllers/positions";
import {addQuestionnaireController, questionnaireController} from "../controllers/questionnaire";
import {resumesController} from "../controllers/resumes";

router.all('/', (req, resp) => handle(req, resp, indexController))

router.all('/login', (req, resp) => handle(req, resp, loginController))
router.all('/register', (req, resp) => handle(req, resp, registerController))
router.all('/logout', (req, resp) => handle(req, resp, logoutController))

router.all('/problems', (req, resp) => handle(req, resp, problemsHandler))
router.all('/problems/add', (req, resp) => handle(req, resp, addProblemsController))

router.all('/positions', (req, resp) => handle(req, resp, positionsController))
router.all('/positions/add', (req, resp) => handle(req, resp, addPositionsController))

router.all('/questionnaire', (req, resp) => handle(req, resp, questionnaireController))
router.all('/questionnaire/add', (req, resp) => handle(req, resp, addQuestionnaireController))

router.all('/resumes', (req, resp) => handle(req, resp, resumesController))

module.exports = router;
