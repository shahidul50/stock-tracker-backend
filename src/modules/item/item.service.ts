import { Document } from "mongoose";
import Category from "../../models/Category.model";
import Company from "../../models/Company.model";
import Item from "../../models/Item.model";
import { AppError } from "../../utils/AppError";
import { TGetItemDetailsByIdResponse, TGetAllItemsResponse, TGetAllItemForSelectResponse } from "./item.type";
import { GetAllItemForSelectQuery, GetAllItemsQuery } from "./item.validation";

//Get All Item with searching, sorting and pagination 
const getAllItems = async (query: GetAllItemsQuery): Promise<TGetAllItemsResponse> => {
  const { searchTerm, categoryId, companyId, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = query;

  const filter: any = {};

  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (categoryId) {
    filter.categoryId = categoryId;
  }

  if (companyId) {
    filter.companyId = companyId;
  }
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const items = await Item.find(filter)
    .populate("categoryId", "name")
    .populate("companyId", "name")
    .skip(skip)
    .limit(limitNum)
    .sort({ [sortBy]: sortOrder });

  const total = await Item.countDocuments(filter);

  const formattedItems = await Promise.all(
    items.map(async (item) => {
      const category = item.categoryId as any;
      const company = item.companyId as any;
      return {
        id: item._id.toString(),
        name: item.name,
        categoryName: category.name,
        companyName: company.name,
        reorderLevel: item.reorderLevel,
        availableQuantity: item.availableQuantity,
        status: (item.availableQuantity <= item.reorderLevel ? "Low Stock" : "In Stock") as "Low Stock" | "In Stock",
      };
    })
  );

  return {
    data: formattedItems,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

//get Item By Id
const getItemDetailsById = async (id: string) => {
  const item = await Item.findById(id)
    .populate("categoryId", "name")
    .populate("companyId", "name");

  if (!item) {
    throw new AppError("Item not found.", 404, "ITEM_NOT_FOUND");
  }

  const category = item.categoryId as any;
  const company = item.companyId as any;

  const formatedItem: TGetItemDetailsByIdResponse = {
    id: item._id.toString(),
    name: item.name,
    description: item.description,
    category: {
      id: category._id.toString(),
      name: category.name,
    },
    company: {
      id: company._id.toString(),
      name: company.name,
    },
    reorderLevel: item.reorderLevel,
    availableQuantity: item.availableQuantity,
    status: (item.availableQuantity <= item.reorderLevel ? "Low Stock" : "In Stock") as "Low Stock" | "In Stock",
  };

  return formatedItem;
};

// get Item For Select
const getAllItemForSelect = async (payload: GetAllItemForSelectQuery): Promise<TGetAllItemForSelectResponse> => {
  const filter: any = {};

  if (payload.categoryId) {
    filter.categoryId = payload.categoryId;
  }

  if (payload.companyId) {
    filter.companyId = payload.companyId;
  }
  const items = await Item.find(filter)

  const data = items.map((item) => ({ label: item.name, value: item._id.toString() }));

  return { data };
}

// cerate New Item
const createItem = async (payload: {
  categoryId: string;
  companyId: string;
  name: string;
  description?: string | undefined;
  reorderLevel: number;
}) => {
  const { categoryId, companyId, name, description, reorderLevel } = payload;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    throw new AppError("Company not found.", 404, "COMPANY_NOT_FOUND");
  }

  const isItemExist = await Item.findOne({ categoryId, companyId, name });

  if (isItemExist) {
    throw new AppError("Item already exists.", 400, "ITEM_ALREADY_EXIST");
  }

  return await Item.create({
    categoryId,
    companyId,
    name,
    description: description || "",
    reorderLevel: reorderLevel ?? 0,
    availableQuantity: 0,
  });
};

//Update Item
const updateItem = async (id: string, payload: {
  categoryId?: string | undefined;
  companyId?: string | undefined;
  name?: string | undefined;
  reorderLevel?: number | undefined;
  description?: string | undefined;
}) => {
  const item = await Item.findById(id);

  if (!item) {
    throw new AppError("Item not found.", 404, "ITEM_NOT_FOUND");
  }

  if (payload.categoryId) item.categoryId = payload.categoryId as any;
  if (payload.companyId) item.companyId = payload.companyId as any;
  if (payload.name && payload.name.trim()) item.name = payload.name.trim();
  if (payload.description !== undefined) item.description = payload.description.trim();
  if (typeof payload.reorderLevel === "number") item.reorderLevel = payload.reorderLevel;

  await item.save();

  return item;
};

//delete Item
const deleteItem = async (id: string) => {
  const item = await Item.findByIdAndDelete(id);

  if (!item) {
    throw new AppError("Item not found.", 404, "ITEM_NOT_FOUND");
  }

  return item;
};

export const itemService = {
  getAllItems,
  getItemDetailsById,
  getAllItemForSelect,
  createItem,
  updateItem,
  deleteItem,
};
