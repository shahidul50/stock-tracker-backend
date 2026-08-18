import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").trim(),
  description: z.string().trim().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").trim().optional(),
  description: z.string().optional(),
});

export const getAllCompanySchema = z.object({
  searchTerm: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateCompanyDTO = z.infer<typeof createCompanySchema>;
export type UpdateCompanyDTO = z.infer<typeof updateCompanySchema>;
export type GetAllCompanyQuery = z.infer<typeof getAllCompanySchema>;
