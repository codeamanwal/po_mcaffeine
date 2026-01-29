import { Router } from "express";
import { masterControllers } from "../controllers/master.controllers.js";
import { SuperAdminMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


/* 
Supported `type` for these api -

1. channel
2. facility
3. courier-partner
4. status
5. courier-rates
6. appointment-remarks
7. sku
*/
router.post("/:type/upload", SuperAdminMiddleware, masterControllers.uploadMasterSheet);
router.post("/:type/delete", SuperAdminMiddleware, masterControllers.deleteMasterSheet);
router.get("/:type", masterControllers.getMasterSheet);
router.get("/:type/search", masterControllers.searchMasterSheet);

export { router as masterRouter };
