import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IItem extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  reorderLevel: number;
  availableQuantity: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

type ItemModel = Model<IItem>;

const itemSchema = new Schema<IItem, ItemModel>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      unique: true,
      trim: true,
      maxlength: [150, "Item name cannot exceed 150 characters"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    reorderLevel: {
      type: Number,
      default: 0,
      min: [0, "Reorder level cannot be negative"],
    },
    availableQuantity: {
      type: Number,
      default: 0,
      min: [0, "Available quantity cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

itemSchema.index({ categoryId: 1, companyId: 1 });

const Item =
  (mongoose.models.Item as ItemModel) ||
  mongoose.model<IItem, ItemModel>("Item", itemSchema);

export default Item;
