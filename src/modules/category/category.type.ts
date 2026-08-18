import { TDropdownSelectItem, TMeta } from "../../types/common.types";

export type TCategoryResponse = {
    _id: string;
    name: string;
    description: string;
    createdDate: string;
    totalItemLinked: number
};

export type TGetAllCategoriesResponse = {
    data: TCategoryResponse[];
    meta: TMeta;
};

export type TGetAllCategoriesForSelectResponse = {
    data: TDropdownSelectItem[]
}