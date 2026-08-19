import mongoose from "mongoose";
import { z } from "zod";

export const createItemSchema = z.object({
  categoryId: z.string().min(1, "Category is required").refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Category ID" }),
  companyId: z.string().min(1, "Company is required").refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Company ID" }),
  name: z.string().min(1, "Item name is required").trim(),
  description: z.string().trim().optional(),
  reorderLevel: z.number().default(0).refine((val) => val > 0, "Reorder level must be a positive number"),
});

export const updateItemSchema = z.object({
  categoryId: z.string().min(1, "Category is required").refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Category ID" }),
  companyId: z.string().min(1, "Company is required").refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Company ID" }),
  name: z.string().min(1, "Item name is required").trim().optional(),
  reorderLevel: z.number().refine((val) => val > 0, "Reorder level must be a positive number").optional(),
  description: z.string().trim().optional(),
});

export const getAllItemsSchema = z.object({
  searchTerm: z.string().optional(),
  categoryId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Category ID" }).optional(),
  companyId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Company ID" }).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
});

export const getAllItemForSelectSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required").refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Category ID" }),
  companyId: z.string().min(1, "Company ID is required").refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid Company ID" }),
});

export type CreateItemDTO = z.infer<typeof createItemSchema>;
export type UpdateItemDTO = z.infer<typeof updateItemSchema>;
export type GetAllItemsQuery = z.infer<typeof getAllItemsSchema>;
export type GetAllItemForSelectQuery = z.infer<typeof getAllItemForSelectSchema>;
