import express, { type Router } from "express";

import { protect } from "../../middlewares/auth";
import { stockOutController } from "./stockOut.controller";

const router: Router = express.Router();

router.use(protect);
router.get("/count/today", stockOutController.getTodayItemsSoldCount);
router.post("/", stockOutController.createStockOut);

export default router;
