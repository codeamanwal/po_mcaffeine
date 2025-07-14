import { Router } from 'express';
import { orderControllers } from '../controllers/order.controllers.js';
import { SuperAndAdminMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post("/create-single-order", SuperAndAdminMiddleware , orderControllers.createSingleOrder);
router.post("/update-single-order", SuperAndAdminMiddleware, orderControllers.updateSingleOrder);
router.post("/create-bulk-orders", SuperAndAdminMiddleware, orderControllers.createBulkOrders);
router.get("/get-all-orders", orderControllers.getAllOrders);

export {router as orderRouter};