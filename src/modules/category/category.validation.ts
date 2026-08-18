import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
  description: z.string().trim().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").trim().optional(),
  description: z.string().optional(),
});

export const getAllCategorySchema = z.object({
  searchTerm: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.string().optional(),
  limit: z.string().optional(),
});


export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
export type GetAllCategoryQuery = z.infer<typeof getAllCategorySchema>;
