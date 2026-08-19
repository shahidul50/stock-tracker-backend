import { z } from "zod";

export const stockInSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().min(1, "Quantity is required").refine((data) => Number.isInteger(data), "Quantity must be an integer value"),
});

export const getAllStockInsSchema = z.object({
  searchTerm: z.string().optional(),
  categoryId: z.string().optional(),
  companyId: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
});

export type StockInDTO = z.infer<typeof stockInSchema>;
export type GetAllStockInsQuery = z.infer<typeof getAllStockInsSchema>;
