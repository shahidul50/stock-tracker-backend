import express, { type Router } from "express";

import { protect } from "../../middlewares/auth";
import { authController } from "./auth.controller";

const router: Router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", protect, authController.getMe);

export default router;
