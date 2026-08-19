import type { Request, Response } from "express";

import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { reportService } from "./report.service";
import { salesReportSchema, stockSummaryReportForExportSchema, stockSummaryReportSchema } from "./report.validation";

// get stock summary report
const getStockSummaryReport = asyncHandler(async (req: Request, res: Response) => {
  //Zod validation
  const validatedData = stockSummaryReportSchema.safeParse(req.query);

  if (!validatedData.success) {
    throw new AppError("Invalid query parameters.", 400, "VALIDATION_ERROR");
  }

  const { companyId, categoryId, limit, page } = validatedData.data;

  const data = await reportService.getSummaryReport(companyId, categoryId, limit, page);

  return sendResponse(res, 200, data);
});

// get stock summary report for export
const getStockSummaryReportForExport = asyncHandler(async (req: Request, res: Response) => {
  //Zod validation
  const validatedData = stockSummaryReportForExportSchema.safeParse(req.query);

  if (!validatedData.success) {
    throw new AppError("Invalid query parameters.", 400, "VALIDATION_ERROR");
  }

  const { companyId, categoryId } = validatedData.data;

  const data = await reportService.getSummaryReportForExport(companyId, categoryId);

  return sendResponse(res, 200, data);
});


// get sales summary report between from date and to date
const getSalesReport = asyncHandler(async (req: Request, res: Response) => {

  //Zod validation
  const validatedData = salesReportSchema.safeParse(req.query);

  if (!validatedData.success) {
    throw new AppError("Invalid date range.", 400, "VALIDATION_ERROR");
  }


  const { fromDate, toDate, limit, page } = validatedData.data;

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new AppError("Invalid date format. Use ISO 8601 format (YYYY-MM-DD).", 400, "VALIDATION_ERROR");
  }

  const data = await reportService.getSalesReport(fromDate, toDate, limit, page);

  return sendResponse(res, 200, data);
});

// get sales summary report for export between from date and to date
const getSalesReportForExport = asyncHandler(async (req: Request, res: Response) => {
  const { fromDate, toDate } = req.query as { fromDate?: string; toDate?: string };

  if (!fromDate || !toDate) {
    throw new AppError("From date and to date are required.", 400, "VALIDATION_ERROR");
  }

  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new AppError("Invalid date format. Use ISO 8601 format (YYYY-MM-DD).", 400, "VALIDATION_ERROR");
  }

  const data = await reportService.getSalesReportForExport(fromDate, toDate);

  return sendResponse(res, 200, data);
});

export const reportController = {
  getStockSummaryReport,
  getStockSummaryReportForExport,
  getSalesReport,
  getSalesReportForExport,
};
