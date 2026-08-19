import { Types } from "mongoose";
import { TMeta } from "../../types/common.types";

export type TStockIn = {
    _id: Types.ObjectId;
    itemName: Types.ObjectId;
    quantity: number;
    categoryName: string;
    companyName: string;
    createdDateTime: string;
}

export type TGetAllStockInResponse = {
    data: TStockIn[];
    meta: TMeta;
}