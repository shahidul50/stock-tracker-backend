import Item from "../../models/Item.model";
import StockIn from "../../models/StockIn.model";
import { AppError } from "../../utils/AppError";
import { GetAllStockInsQuery } from "./stockIn.validation";
import { TGetAllStockInResponse } from "./stockIn.type";

const formatDateTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return formatter.format(date).replace(/\s+([AP]M)$/i, '$1');
};

//get all stockIns with searching, sorting and pagination
const getAllStockIns = async (query: GetAllStockInsQuery): Promise<TGetAllStockInResponse> => {
  //destructure query
  const { searchTerm, categoryId, companyId, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = query;

  //filtering
  const where: Record<string, any> = {};

  // Resolve base allowed items from categoryId & companyId
  let allowedItemIds: any[] | null = null;
  if (categoryId || companyId) {
    const itemQuery: Record<string, any> = {};
    if (categoryId) itemQuery.categoryId = categoryId;
    if (companyId) itemQuery.companyId = companyId;
    const items = await Item.find(itemQuery).select('_id');
    allowedItemIds = items.map(i => i._id);

    if (allowedItemIds.length === 0) {
      where._id = null; // No items match the category/company
    } else {
      where.itemId = { $in: allowedItemIds };
    }
  }

  // Handle searchTerm (itemName or Date)
  if (searchTerm && where._id !== null) {
    const orConditions: any[] = [];

    // 1. Match by itemName
    const itemSearchQuery: Record<string, any> = { name: { $regex: searchTerm, $options: "i" } };
    if (allowedItemIds) {
      itemSearchQuery._id = { $in: allowedItemIds };
    }
    const matchingItems = await Item.find(itemSearchQuery).select('_id');
    if (matchingItems.length > 0) {
      orConditions.push({ itemId: { $in: matchingItems.map(i => i._id) } });
    }

    // 2. Match by Date (DD-MM-YYYY or DD/MM/YYYY)
    const dateMatch = searchTerm.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1] as string);
      const month = parseInt(dateMatch[2] as string);
      const year = parseInt(dateMatch[3] as string);

      const startDate = new Date(year, month - 1, day);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(year, month - 1, day);
      endDate.setHours(23, 59, 59, 999);

      orConditions.push({ createdAt: { $gte: startDate, $lte: endDate } });
    }

    if (orConditions.length > 0) {
      where.$or = orConditions;
    } else {
      where._id = null; // Search term yielded no results
    }
  }

  //sorting
  const sort: Record<string, any> = {};

  let sortField = sortBy || "createdAt";
  if (sortField === "createdDateTime" || sortField === "date") {
    sortField = "createdAt";
  }

  const isPopulatedFieldSort = ["name", "itemName", "categoryName", "companyName"].includes(sortField);

  if (!isPopulatedFieldSort && sortField) {
    sort[sortField] = sortOrder === "desc" ? -1 : 1;
  }

  //pagination
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;
  const skip = (pageNum - 1) * limitNum;

  let stockInsQuery = StockIn.find(where).populate({
    path: "itemId",
    select: "name categoryId companyId",
    populate: [
      { path: "categoryId", select: "name" },
      { path: "companyId", select: "name" }
    ]
  });

  if (!isPopulatedFieldSort) {
    stockInsQuery = stockInsQuery.sort(sort).skip(skip).limit(limitNum);
  }

  let stockInsData = await stockInsQuery;

  // In-memory sort for populated fields
  if (isPopulatedFieldSort) {
    stockInsData.sort((a: any, b: any) => {
      let valA = "";
      let valB = "";

      if (sortField === "name" || sortField === "itemName") {
        valA = a.itemId?.name?.toLowerCase() || "";
        valB = b.itemId?.name?.toLowerCase() || "";
      } else if (sortField === "categoryName") {
        valA = a.itemId?.categoryId?.name?.toLowerCase() || "";
        valB = b.itemId?.categoryId?.name?.toLowerCase() || "";
      } else if (sortField === "companyName") {
        valA = a.itemId?.companyId?.name?.toLowerCase() || "";
        valB = b.itemId?.companyId?.name?.toLowerCase() || "";
      }

      if (valA < valB) return sortOrder === "desc" ? 1 : -1;
      if (valA > valB) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });

    // manual pagination after sorting
    stockInsData = stockInsData.slice(skip, skip + limitNum);
  }

  const total = await StockIn.countDocuments(where);

  const stockIns = stockInsData.map((stockIn) => {
    const item = stockIn.itemId as any;
    return {
      _id: stockIn._id,
      itemName: item?.name,
      quantity: stockIn.quantity,
      categoryName: item?.categoryId?.name || "",
      companyName: item?.companyId?.name || "",
      createdDateTime: formatDateTime(new Date(stockIn.createdAt)),
    };
  }) as any;

  return { data: stockIns, meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } };
};

//create stock-in
const createStockIn = async (itemId: string, quantity: number) => {
  const item = await Item.findById(itemId);
  if (!item) {
    throw new AppError("Item not found.", 404, "ITEM_NOT_FOUND");
  }

  const stockIn = await StockIn.create({ itemId, quantity });

  //update item availableQuantity
  item.availableQuantity += quantity;
  await item.save();

  return stockIn;
};

export const stockInService = {
  getAllStockIns,
  createStockIn,
};
