import { Router } from 'express';
import {adminController} from "../controllers/admin.controllers.js"

const router = Router();

router.post("/create-admin", adminController.createAdmin);
router.post("/login", adminController.login);


router.post('/create-warehouse', adminController.createWareHouse);
router.post('/create-logistic', adminController.createLogistic);

router.post('/create-order', adminController.createOrder)

router.get('/get-all-wareouses', adminController.getAllWareHouses);
router.get('/get-all-logistics', adminController.getAllLogistics);

export {router as adminRouter};
