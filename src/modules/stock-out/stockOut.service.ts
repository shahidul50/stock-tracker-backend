import mongoose from "mongoose";

import Item from "../../models/Item.model";
import StockOut, { type StockOutType } from "../../models/StockOut.model";
import { AppError } from "../../utils/AppError";

export type StockOutItemPayload = {
  itemId: string;
  quantity: number;
  type: StockOutType;
};

// get today items sold count
const getTodayItemsSoldCount = async () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;

  // Create a Date object for exactly 00:00:00 in Dhaka timezone (+06:00)
  const today = new Date(`${year}-${month}-${day}T00:00:00.000+06:00`);

  const count = await StockOut.countDocuments({ createdAt: { $gte: today } });
  return { count };
};

// create stock-out data with transaction and update availableQuantity in items collection
const createStockOut = async (items: StockOutItemPayload[]) => {
  const session = await mongoose.startSession();
  let createdEntries: any[] = [];

  try {
    await session.withTransaction(async () => {
      for (const entry of items) {
        const item = await Item.findById(entry.itemId).session(session);

        if (!item) {
          throw new AppError("Item not found.", 404, "ITEM_NOT_FOUND");
        }

        if (entry.quantity > item.availableQuantity) {
          throw new AppError(
            `Insufficient stock for item: ${item.name}. Available: ${item.availableQuantity}`,
            400,
            "INSUFFICIENT_STOCK",
          );
        }

        item.availableQuantity -= entry.quantity;
        await item.save({ session });

        const stockOutRecord = await StockOut.create(
          [{ itemId: entry.itemId, quantity: entry.quantity, type: entry.type }],
          { session },
        );

        createdEntries.push(...stockOutRecord);
      }
    });

    return createdEntries;
  } finally {
    await session.endSession();
  }
};

export const stockOutService = {
  getTodayItemsSoldCount,
  createStockOut,
};
