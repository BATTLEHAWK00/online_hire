import express from 'express';

const router = express.Router();
import {handle} from "../service/controller";
import {loginController, registerController} from '../controllers/user'
import {indexController} from "../controllers/index";
import {problemsHandler} from "../controllers/problems";
import {positionsController} from "../controllers/positions";
import {questionnaireController} from "../controllers/questionnaire";
import {resumesController} from "../controllers/resumes";

router.all('/', (req, resp) => handle(req, resp, indexController))
router.all('/login', (req, resp) => handle(req, resp, loginController))
router.all('/register', (req, resp) => handle(req, resp, registerController))
router.all('/problems', (req, resp) => handle(req, resp, problemsHandler))
router.all('/positions', (req, resp) => handle(req, resp, positionsController))
router.all('/questionnaire', (req, resp) => handle(req, resp, questionnaireController))
router.all('/resumes', (req, resp) => handle(req, resp, resumesController))

module.exports = router;
