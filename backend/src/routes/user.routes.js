import { Router } from "express";
import { userControllers } from "../controllers/user.controllers.js";

const router = Router();

router.post("/create-user", userControllers.createUser);

router.post("/delete-user", userControllers.deleteUser);

router.get("/get-all-users", userControllers.getAllUsers);

router.post("/change-user-password", userControllers.changeYourPassword);

router.post("/update-user", userControllers.updateUser);

export {router as userRouter};