import mongoose from "mongoose";
import { z } from "zod";

export const salesReportSchema = z.object({
  fromDate: z.string(),
  toDate: z.string(),
  limit: z.string().optional(),
  page: z.string().optional(),
});

export const stockSummaryReportSchema = z.object({
  categoryId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Category ID" }).optional(),
  companyId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Company ID" }).optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
});

export const stockSummaryReportForExportSchema = z.object({
  categoryId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Category ID" }).optional(),
  companyId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Company ID" }).optional(),
});

export type SalesReportDTO = z.infer<typeof salesReportSchema>;
export type StockSummaryReportDTO = z.infer<typeof stockSummaryReportSchema>;
export type StockSummaryReportForExportDTO = z.infer<typeof stockSummaryReportForExportSchema>;
