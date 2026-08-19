import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { getAllStockInsSchema, stockInSchema } from "./stockIn.validation";
import { stockInService } from "./stockIn.service";
import { AppError } from "../../utils/AppError";


//get all stockIns with searching, sorting and pagination
const getAllStockIns = asyncHandler(async (req: Request, res: Response) => {

  //zod validation
  const parsed = getAllStockInsSchema.safeParse(req.query);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const stockIns = await stockInService.getAllStockIns(parsed.data);
  return sendResponse(res, 200, stockIns);
});

//create stockIn
const createStockIn = asyncHandler(async (req: Request, res: Response) => {

  //zod validation
  const parsed = stockInSchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const stockIn = await stockInService.createStockIn(parsed.data.itemId, parsed.data.quantity);

  return sendResponse(res, 201, stockIn, "Stock-in recorded successfully");
});

export const stockInController = {
  getAllStockIns,
  createStockIn,
};
