import { Router } from "express";
import { userControllers } from "../controllers/user.controllers.js";
import { SuperOrAdminMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-user", SuperOrAdminMiddleware, userControllers.createUser);

router.post("/delete-user", SuperOrAdminMiddleware, userControllers.deleteUser);

router.get("/get-all-users", userControllers.getAllUsers);

router.post("/change-user-password", userControllers.changeYourPassword);

router.post("/update-user", userControllers.updateUser);

export {router as userRouter};