import { Router } from "express";
import { masterControllers } from "../controllers/master.controllers.js";

const router = Router();

router.post("/:type/upload", masterControllers.uploadMasterSheet);
router.post("/:type/delete", masterControllers.deleteMasterSheet);
router.get("/:type", masterControllers.getMasterSheet);
router.get("/:type/search", masterControllers.searchMasterSheet);

export { router as masterRouter };
