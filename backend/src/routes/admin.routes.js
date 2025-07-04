import { Router } from 'express';
import {adminController} from "../controllers/admin.controllers.js"
import { AdminMiddleware, SuperAdminMiddleware } from '../middleware/auth.middleware.js';

const router = Router();


router.post("/create-admin", adminController.createAdmin);
router.post("/login", adminController.login);


router.post('/create-warehouse', AdminMiddleware, adminController.createWareHouse);
router.post('/create-logistic', AdminMiddleware, adminController.createLogistic);

router.post('/create-order', AdminMiddleware, adminController.createOrder)

router.get('/get-all-wareouses', adminController.getAllWareHouses);
router.get('/get-all-logistics', adminController.getAllLogistics);

export {router as adminRouter};
