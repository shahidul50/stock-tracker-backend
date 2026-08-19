import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { createItemSchema, getAllItemForSelectSchema, getAllItemsSchema, updateItemSchema } from "./item.validation";
import { itemService } from "./item.service";
import { AppError } from "../../utils/AppError";

//get all items with searching, sorting and pagination
const getAllItems = asyncHandler(async (req: Request, res: Response) => {
  //Zod validation
  const parsed = getAllItemsSchema.safeParse(req.query);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }
  const items = await itemService.getAllItems(parsed.data);
  return sendResponse(res, 200, items);
});

//get item by Id
const getItemDetailsById = asyncHandler(async (req: Request, res: Response) => {
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!itemId) {
    throw new AppError("Item ID is required.", 400, "VALIDATION_ERROR");
  }

  const item = await itemService.getItemDetailsById(itemId);

  return sendResponse(res, 200, item);
});

// get item for select
const getAllItemForSelect = asyncHandler(async (req: Request, res: Response) => {
  //zod validation
  const parsed = getAllItemForSelectSchema.safeParse(req.query);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }
  const items = await itemService.getAllItemForSelect(parsed.data);
  return sendResponse(res, 200, items);
});

//create New Item
const createItem = asyncHandler(async (req: Request, res: Response) => {

  const parsed = createItemSchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const item = await itemService.createItem(parsed.data);

  return sendResponse(res, 201, item, "Item created successfully");
});

// update Item
const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!itemId) {
    throw new AppError("Item ID is required.", 400, "VALIDATION_ERROR");
  }

  //Zod Validation
  const parsed = updateItemSchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const item = await itemService.updateItem(itemId, parsed.data);

  return sendResponse(res, 200, item, "Item updated successfully");
});

// delete Item
const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!itemId) {
    throw new AppError("Item ID is required.", 400, "VALIDATION_ERROR");
  }

  const item = await itemService.deleteItem(itemId);

  return sendResponse(res, 200, item, "Item deleted successfully");
});

export const itemController = {
  getAllItems,
  getItemDetailsById,
  getAllItemForSelect,
  createItem,
  updateItem,
  deleteItem,
};
