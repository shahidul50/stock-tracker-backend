import Item from "../../models/Item.model";
import StockOut from "../../models/StockOut.model";
import { AppError } from "../../utils/AppError";
import { TSalesReportForExportResponse, TSalesReportResponse, TStockSummaryForExportResponse, TStockSummaryItem, TStockSummaryResponse } from "./report.type";

// get stock summary report with pagination
const getSummaryReport = async (companyId?: string, categoryId?: string, limit?: string, page?: string): Promise<TStockSummaryResponse> => {
  const query: Record<string, any> = {};
  if (companyId) query.companyId = companyId;
  if (categoryId) query.categoryId = categoryId;

  const limitNum = limit ? parseInt(limit) : 10;
  const pageNum = page ? parseInt(page) : 1;
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Item.find(query)
      .populate("companyId", "name")
      .populate("categoryId", "name")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum),
    Item.countDocuments(query),
  ]);

  const data: TStockSummaryItem[] = items.map((item) => {
    const companyName = item.companyId && typeof item.companyId === "object" && "name" in item.companyId ? (item.companyId.name as string) : "";
    const categoryName = item.categoryId && typeof item.categoryId === "object" && "name" in item.categoryId ? (item.categoryId.name as string) : "";

    return {
      itemName: item.name,
      companyName,
      categoryName,
      availableQty: item.availableQuantity,
      reorderLevel: item.reorderLevel,
      status: item.availableQuantity === 0 ? "Out of Stock" : item.availableQuantity <= item.reorderLevel ? "Low Stock" : "In Stock",
    };
  });

  return {
    data,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

// get stock summary report for export
const getSummaryReportForExport = async (companyId?: string, categoryId?: string): Promise<TStockSummaryForExportResponse> => {
  const query: Record<string, any> = {};
  if (companyId) query.companyId = companyId;
  if (categoryId) query.categoryId = categoryId;

  const items = await Item.find(query)
    .populate("companyId", "name")
    .populate("categoryId", "name")
    .sort({ name: 1 });

  const data: TStockSummaryItem[] = items.map((item) => {
    const companyName = item.companyId && typeof item.companyId === "object" && "name" in item.companyId ? (item.companyId.name as string) : "";
    const categoryName = item.categoryId && typeof item.categoryId === "object" && "name" in item.categoryId ? (item.categoryId.name as string) : "";

    return {
      itemName: item.name,
      companyName,
      categoryName,
      availableQty: item.availableQuantity,
      reorderLevel: item.reorderLevel,
      status: item.availableQuantity === 0 ? "Out of Stock" : item.availableQuantity <= item.reorderLevel ? "Low Stock" : "In Stock",
    };
  });

  return { data };
};

// get sales report between from date and to date
const getSalesReport = async (fromDate: string, toDate: string, limit?: string, page?: string): Promise<TSalesReportResponse> => {
  const start = new Date(fromDate);
  const end = new Date(toDate);

  const limitNum = limit ? parseInt(limit) : 10;
  const pageNum = page ? parseInt(page) : 1;
  const skip = (pageNum - 1) * limitNum;

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError("Invalid date range.", 400, "VALIDATION_ERROR");
  }

  // Optional: Ensure end date covers the whole day if they just passed "YYYY-MM-DD"
  end.setUTCHours(23, 59, 59, 999);

  if (start > end) {
    throw new AppError("From date cannot be greater than to date.", 400, "VALIDATION_ERROR");
  }

  // Use aggregation pipeline — grouping, counting, and pagination all happen at DB level
  const result = await StockOut.aggregate([
    // Stage 1: Match sales within date range
    {
      $match: {
        type: "Sell",
        createdAt: { $gte: start, $lte: end },
      },
    },

    // Stage 2: Lookup Item details
    {
      $lookup: {
        from: "items",
        localField: "itemId",
        foreignField: "_id",
        as: "item",
      },
    },
    { $unwind: { path: "$item", preserveNullAndEmptyArrays: false } },

    // Stage 3: Lookup Category name
    {
      $lookup: {
        from: "categories",
        localField: "item.categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

    // Stage 4: Lookup Company name
    {
      $lookup: {
        from: "companies",
        localField: "item.companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },

    // Stage 5: Group by itemId + sold date
    {
      $group: {
        _id: {
          itemId: "$item._id",
          soldDate: {
            $dateToString: { format: "%b %d, %Y", date: "$createdAt" },
          },
        },
        itemName: { $first: "$item.name" },
        categoryName: { $first: { $ifNull: ["$category.name", "Unknown"] } },
        companyName: { $first: { $ifNull: ["$company.name", "Unknown"] } },
        totalSoldQty: { $sum: "$quantity" },
      },
    },

    // Stage 6: Project clean output
    {
      $project: {
        _id: 0,
        itemName: 1,
        categoryName: 1,
        companyName: 1,
        totalSoldQty: 1,
        soldDate: "$_id.soldDate",
      },
    },

    // Stage 7: Sort by soldDate descending
    { $sort: { soldDate: -1 } },

    // Stage 8: Use $facet to get both paginated data and total count in one query
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limitNum }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const data = result[0]?.data || [];
  const totalSales = result[0]?.totalCount[0]?.count || 0;

  return {
    data,
    meta: {
      total: totalSales,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalSales / limitNum),
    },
  };
};

// get sales summary report for export between from date and to date
const getSalesReportForExport = async (fromDate: string, toDate: string): Promise<TSalesReportForExportResponse> => {
  const start = new Date(fromDate);
  const end = new Date(toDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError("Invalid date range.", 400, "VALIDATION_ERROR");
  }

  // Optional: Ensure end date covers the whole day if they just passed "YYYY-MM-DD"
  end.setUTCHours(23, 59, 59, 999);

  if (start > end) {
    throw new AppError("From date cannot be greater than to date.", 400, "VALIDATION_ERROR");
  }

  const sales = await StockOut.find({
    type: "Sell",
    createdAt: {
      $gte: start,
      $lte: end,
    },
  }).populate({
    path: "itemId",
    select: "name categoryId companyId",
    populate: [
      { path: "categoryId", select: "name" },
      { path: "companyId", select: "name" }
    ]
  });

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const grouped: Record<string, any> = {};

  for (const entry of sales) {
    const item = entry.itemId as any;
    if (!item) continue;

    const itemName = item.name || "Unknown";
    const categoryName = item.categoryId?.name || "Unknown";
    const companyName = item.companyId?.name || "Unknown";

    const dateStr = formatter.format(entry.createdAt);
    const groupKey = `${item._id.toString()}-${dateStr}`;

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        itemName,
        categoryName,
        companyName,
        totalSoldQty: 0,
        soldDate: dateStr,
      };
    }

    grouped[groupKey].totalSoldQty += entry.quantity;
  }

  const data = Object.values(grouped);

  return { data };
};

export const reportService = {
  getSummaryReport,
  getSummaryReportForExport,
  getSalesReport,
  getSalesReportForExport
};
