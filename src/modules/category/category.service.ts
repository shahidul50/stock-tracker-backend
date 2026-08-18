import Category from "../../models/Category.model";
import Item from "../../models/Item.model";
import { AppError } from "../../utils/AppError";
import { type GetAllCategoryQuery } from "./category.validation";
import { TGetAllCategoriesForSelectResponse, type TGetAllCategoriesResponse } from "./category.type";
import { ca } from "zod/locales";

// get all categories with searching, sorting and pagination
const getAllCategories = async (query: GetAllCategoryQuery): Promise<TGetAllCategoriesResponse> => {
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

  const categories = await Category.find(queryFilter)
    .sort(sortCriteria)
    .skip(skip)
    .limit(limitNum);

  const total = await Category.countDocuments(queryFilter);

  const formattedCategories = await Promise.all(
    categories.map(async (category) => {
      const totalItemLinked = await Item.countDocuments({ categoryId: category._id });
      return {
        _id: category._id.toString(),
        name: category.name,
        description: category.description || "",
        createdDate: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(category.createdAt as Date)),
        totalItemLinked,
      };
    })
  );

  return { data: formattedCategories, meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } };
};

//get category Details by categoryId
const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  }
  return {
    _id: category._id.toString(),
    name: category.name,
    description: category.description
  };
};

//cheak if category exist
const checkCategoryExists = async (name: string) => {
  const category = await Category.findOne({ name });
  return !!category;
};

// get all categories for select dropdown
const getAllCategoriesForSelect = async (): Promise<TGetAllCategoriesForSelectResponse> => {
  const categories = await Category.find().select("name");
  const data = categories.map((category) => ({ label: category.name, value: category._id.toString() }));
  return { data };
};

// create new caregory
const createCategory = async (name: string, description?: string) => {
  return await Category.create({
    name: name.trim(),
    description: description || "",
  });
};

// update category
const updateCategory = async (id: string, name?: string, description?: string) => {
  const updateData: Record<string, any> = {};
  if (name) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description.trim();

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No fields to update.", 400, "VALIDATION_ERROR");
  }

  const category = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

  if (!category) {
    throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  }

  return category;
};

// delete category
const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  }

  return category;
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  getAllCategoriesForSelect,
  createCategory,
  updateCategory,
  deleteCategory,
  checkCategoryExists,
};
