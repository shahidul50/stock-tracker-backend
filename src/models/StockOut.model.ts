import mongoose, { Schema, type Document, type Model } from "mongoose";

export type StockOutType = "Sell" | "Damage" | "Lost";

export interface IStockOut extends Document {
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  type: StockOutType;
  createdAt: Date;
  updatedAt: Date;
}

type StockOutModel = Model<IStockOut>;

const stockOutSchema = new Schema<IStockOut, StockOutModel>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be greater than 0"],
    },
    type: {
      type: String,
      enum: ["Sell", "Damage", "Lost"],
      required: [true, "Stock out type is required"],
    },
  },
  {
    timestamps: true,
  },
);

const StockOut =
  (mongoose.models.StockOut as StockOutModel) ||
  mongoose.model<IStockOut, StockOutModel>("StockOut", stockOutSchema);

export default StockOut;
