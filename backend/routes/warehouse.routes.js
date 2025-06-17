import { Router } from 'express';
import { warehouseController } from '../controllers/wareouse.controllers.js';

const router = Router();

router.post("/login", warehouseController.login);

export {router as warehouseRouter};
