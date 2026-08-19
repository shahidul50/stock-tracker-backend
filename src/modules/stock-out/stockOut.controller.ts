import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { stockOutSchema } from "./stockOut.validation";
import { stockOutService } from "./stockOut.service";
import { AppError } from "../../utils/AppError";

// get today items sold count
const getTodayItemsSoldCount = asyncHandler(async (_req: Request, res: Response) => {
  const totalCount = await stockOutService.getTodayItemsSoldCount();
  return sendResponse(res, 200, totalCount);
});

//create stock-out data with transaction and update availableQuantity in items collection
const createStockOut = asyncHandler(async (req: Request, res: Response) => {
  const parsed = stockOutSchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const createdEntries = await stockOutService.createStockOut(parsed.data.items);

  return sendResponse(res, 201, createdEntries, "Stock-out processed successfully");
});

export const stockOutController = {
  getTodayItemsSoldCount,
  createStockOut,
};
