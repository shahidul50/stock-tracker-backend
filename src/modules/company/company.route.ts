import express, { type Router } from "express";

import { protect } from "../../middlewares/auth";
import { companyController } from "./company.controller";

const router: Router = express.Router();

router.use(protect);
router.get("/", companyController.getAllCompanies);
router.get("/select", companyController.getAllCompaniesForSelect);
router.get("/:id", companyController.getCompanyById);
router.post("/", companyController.createCompany);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

export default router;
