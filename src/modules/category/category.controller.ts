import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { createCategorySchema, updateCategorySchema, getAllCategorySchema } from "./category.validation";
import { categoryService } from "./category.service";
import { AppError } from "../../utils/AppError";

//get all categories with search, sorting, pagination
const getAllCategories = asyncHandler(async (req: Request, res: Response) => {

  //zod validation
  const parseResult = getAllCategorySchema.safeParse(req.query);

  if (!parseResult.success) {
    const errorMessage = parseResult.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const categories = await categoryService.getAllCategories(parseResult.data);
  return sendResponse(res, 200, categories);
});

// get category by CategoryId
const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!categoryId) {
    throw new AppError("Category ID is required.", 400, "VALIDATION_ERROR");
  }

  const category = await categoryService.getCategoryById(categoryId);

  return sendResponse(res, 200, category);
});

// get all categories for select dropdown
const getAllCategoriesForSelect = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategoriesForSelect();
  return sendResponse(res, 200, categories);
});

// create new category
const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createCategorySchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  if (await categoryService.checkCategoryExists(parsed.data.name)) {
    throw new AppError("Category already exists.", 400, "VALIDATION_ERROR");
  }

  const category = await categoryService.createCategory(parsed.data.name, parsed.data.description);

  return sendResponse(res, 201, category, "Category created successfully");
});

// update category
const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!categoryId) {
    throw new AppError("Category ID is required.", 400, "VALIDATION_ERROR");
  }

  const parsed = updateCategorySchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const category = await categoryService.updateCategory(categoryId, parsed.data.name, parsed.data.description);

  return sendResponse(res, 200, category, "Category updated successfully");
});

// delete category
const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!categoryId) {
    throw new AppError("Category ID is required.", 400, "VALIDATION_ERROR");
  }

  const category = await categoryService.deleteCategory(categoryId);

  return sendResponse(res, 200, category, "Category deleted successfully");
});

export const categoryController = {
  getAllCategories,
  getCategoryById,
  getAllCategoriesForSelect,
  createCategory,
  updateCategory,
  deleteCategory,
};
