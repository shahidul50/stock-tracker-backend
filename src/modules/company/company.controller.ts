import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { createCompanySchema, getAllCompanySchema, updateCompanySchema } from "./company.validation";
import { companyService } from "./company.service";
import { AppError } from "../../utils/AppError";

//get all companies with search, sorting, pagination
const getAllCompanies = asyncHandler(async (req: Request, res: Response) => {
  //zod validation
  const parsed = getAllCompanySchema.safeParse(req.query);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }
  const companies = await companyService.getAllCompanies(parsed.data);
  return sendResponse(res, 200, companies);
});

// get company by companyId
const getCompanyById = asyncHandler(async (req: Request, res: Response) => {
  const companyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!companyId) {
    throw new AppError("Company ID is required.", 400, "VALIDATION_ERROR");
  }

  const company = await companyService.getCompanyById(companyId);

  return sendResponse(res, 200, company);
});

// get all companies for select dropdown
const getAllCompaniesForSelect = asyncHandler(async (_req: Request, res: Response) => {
  const companies = await companyService.getAllCompaniesForSelect();
  return sendResponse(res, 200, companies);
});

// create new company
const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createCompanySchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  // cheack company already exist
  const existingCompany = await companyService.checkCompanyExists(parsed.data.name);
  if (existingCompany) {
    throw new AppError("Company already exists.", 400, "COMPANY_ALREADY_EXISTS");
  }

  const company = await companyService.createCompany(parsed.data.name, parsed.data.description);

  return sendResponse(res, 201, company, "Company created successfully");
});

// update company
const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const companyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!companyId) {
    throw new AppError("Company ID is required.", 400, "VALIDATION_ERROR");
  }

  const parsed = updateCompanySchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const company = await companyService.updateCompany(companyId, parsed.data.name, parsed.data.description);

  return sendResponse(res, 200, company, "Company updated successfully");
});

// delete company
const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const companyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!companyId) {
    throw new AppError("Company ID is required.", 400, "VALIDATION_ERROR");
  }

  const company = await companyService.deleteCompany(companyId);

  return sendResponse(res, 200, company, "Company deleted successfully");
});

export const companyController = {
  getAllCompanies,
  getCompanyById,
  getAllCompaniesForSelect,
  createCompany,
  updateCompany,
  deleteCompany,
};
