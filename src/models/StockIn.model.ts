import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IStockIn extends Document {
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

type StockInModel = Model<IStockIn>;

const stockInSchema = new Schema<IStockIn, StockInModel>(
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
  },
  {
    timestamps: true,
  },
);

const StockIn =
  (mongoose.models.StockIn as StockInModel) ||
  mongoose.model<IStockIn, StockInModel>("StockIn", stockInSchema);

export default StockIn;
