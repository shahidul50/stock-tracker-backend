import express, { type Router } from "express";

import { protect } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router: Router = express.Router();

router.use(protect);
router.get("/", categoryController.getAllCategories);
router.get("/select", categoryController.getAllCategoriesForSelect);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
