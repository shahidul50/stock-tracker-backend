import Company from "../../models/Company.model";
import { AppError } from "../../utils/AppError";
import { type GetAllCompanyQuery } from "./company.validation";
import { TGetAllCompaniesForSelectResponse, type TGetAllCompaniesResponse } from "./company.type";
import Item from "../../models/Item.model";

// get all companies with searching, sorting and pagination
const getAllCompanies = async (query: GetAllCompanyQuery): Promise<TGetAllCompaniesResponse> => {
  const { searchTerm, sortBy, sortOrder, page = "1", limit = "10" } = query;

  // Build query
  const queryFilter: any = {};

  if (searchTerm) {
    queryFilter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Sorting
  const sortCriteria: any = {};
  if (sortBy) {
    sortCriteria[sortBy] = sortOrder?.toLowerCase() === "desc" ? -1 : 1;
  } else {
    // Default sort: newest first
    sortCriteria.createdAt = -1;
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const companies = await Company.find(queryFilter)
    .sort(sortCriteria)
    .skip(skip)
    .limit(limitNum);

  const total = await Company.countDocuments(queryFilter);

  const formattedCompanies = await Promise.all(
    companies.map(async (company) => {
      const totalItemLinked = await Item.countDocuments({ companyId: company._id });
      return {
        _id: company._id.toString(),
        name: company.name,
        description: company.description || "",
        createdDate: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(company.createdAt as Date)),
        totalItemLinked,
      };
    })
  );

  return { data: formattedCompanies, meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } };
};

//get company Details by companyId
const getCompanyById = async (id: string) => {
  const company = await Company.findById(id);
  if (!company) {
    throw new AppError("Company not found.", 404, "COMPANY_NOT_FOUND");
  }
  return {
    _id: company._id.toString(),
    name: company.name,
    description: company.description
  };
};

//cheak if company exist
const checkCompanyExists = async (name: string) => {
  const company = await Company.findOne({ name });
  return !!company;
};

// get all companies for select
const getAllCompaniesForSelect = async (): Promise<TGetAllCompaniesForSelectResponse> => {
  const companies = await Company.find();
  const data = companies.map((company) => ({ label: company.name, value: company._id.toString() }));
  return { data };
};

// create new company
const createCompany = async (name: string, description?: string) => {
  return await Company.create({
    name: name,
    description: description || "",
  });
};

// update company
const updateCompany = async (id: string, name?: string, description?: string) => {
  const updateData: Record<string, any> = {};
  if (name) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description.trim();

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No fields to update.", 400, "VALIDATION_ERROR");
  }

  const company = await Company.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

  if (!company) {
    throw new AppError("Company not found.", 404, "COMPANY_NOT_FOUND");
  }

  return company;
};

const deleteCompany = async (id: string) => {
  const company = await Company.findByIdAndDelete(id);

  if (!company) {
    throw new AppError("Company not found.", 404, "COMPANY_NOT_FOUND");
  }

  return company;
};

export const companyService = {
  getAllCompanies,
  getCompanyById,
  getAllCompaniesForSelect,
  checkCompanyExists,
  createCompany,
  updateCompany,
  deleteCompany,
};
