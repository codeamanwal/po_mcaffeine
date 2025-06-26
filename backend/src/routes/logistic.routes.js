import { Router } from 'express';
import {logisticController} from "../controllers/logistic.controllers.js"

const router = Router();

router.post("/login", logisticController.login);

export {router as logisticRouter};
