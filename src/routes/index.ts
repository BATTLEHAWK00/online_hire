import express from 'express';

const router = express.Router();
import {handle} from "../service/controller";
import {loginController, logoutController, registerController, userDetailController} from '../controllers/user'
import {indexController, testController} from "../controllers/index";
import {addProblemsController, chooseProblemsTypeController, problemsHandler} from "../controllers/problems";
import {addPositionsController, deletePositionController, positionsController} from "../controllers/positions";
import {addQuestionnaireController, questionnaireController} from "../controllers/questionnaire";
import {resumesController} from "../controllers/resumes";

router.all('/', (req, resp) => handle(req, resp, indexController))

router.all('/user/:uid', (req, resp) => handle(req, resp, userDetailController))
router.all('/login', (req, resp) => handle(req, resp, loginController))
router.all('/register', (req, resp) => handle(req, resp, registerController))
router.all('/logout', (req, resp) => handle(req, resp, logoutController))

router.all('/problems', (req, resp) => handle(req, resp, problemsHandler))
router.all('/problems/add', (req, resp) => handle(req, resp, chooseProblemsTypeController))
router.all('/problems/add/:problemType', (req, resp) => handle(req, resp, addProblemsController))

router.all('/positions', (req, resp) => handle(req, resp, positionsController))
router.all('/positions/add', (req, resp) => handle(req, resp, addPositionsController))
router.all('/positions/delete/:_id', (req, resp) => handle(req, resp, deletePositionController))

router.all('/questionnaire', (req, resp) => handle(req, resp, questionnaireController))
router.all('/questionnaire/add', (req, resp) => handle(req, resp, addQuestionnaireController))

router.all('/resumes', (req, resp) => handle(req, resp, resumesController))

router.all('/test', (req, resp) => handle(req, resp, testController))

export default router
