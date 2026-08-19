import express, { type Router } from "express";

import { protect } from "../../middlewares/auth";
import { itemController } from "./item.controller";

const router: Router = express.Router();

router.use(protect);
router.get("/", itemController.getAllItems);
router.get("/select", itemController.getAllItemForSelect);
router.get("/:id", itemController.getItemDetailsById);
router.post("/", itemController.createItem);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

export default router;
