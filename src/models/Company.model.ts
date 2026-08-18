import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

type CompanyModel = Model<ICompany>;

const companySchema = new Schema<ICompany, CompanyModel>(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
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

const Company =
  (mongoose.models.Company as CompanyModel) ||
  mongoose.model<ICompany, CompanyModel>("Company", companySchema);

export default Company;
