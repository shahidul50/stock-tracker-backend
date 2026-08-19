import express, { type Router } from "express";

import { protect } from "../../middlewares/auth";
import { stockInController } from "./stockIn.controller";

const router: Router = express.Router();

router.use(protect);
router.get("/", stockInController.getAllStockIns);
router.post("/", stockInController.createStockIn);

export default router;
