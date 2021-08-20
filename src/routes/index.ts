import express from 'express';

const router = express.Router();
import {handle} from "../service/controller";
import {loginController} from '../controllers/user'

router.all('/', (req, resp) => {
    handle(req, resp, loginController)
})

module.exports = router;
