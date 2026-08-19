import express, { type Router } from "express";

import { protect } from "../../middlewares/auth";
import { reportController } from "./report.controller";

const router: Router = express.Router();

router.use(protect);
router.get("/stock-summary", reportController.getStockSummaryReport);
router.get("/stock-summary/export", reportController.getStockSummaryReportForExport);
router.get("/sales", reportController.getSalesReport);
router.get("/sales/export", reportController.getSalesReportForExport);

export default router;
