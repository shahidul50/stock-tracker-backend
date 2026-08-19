import { TDropdownSelectItem, TMeta } from "../../types/common.types";

export type TGetItemDetailsByIdResponse = {
    id: string;
    name: string;
    description: string | undefined;
    category: {
        id: string;
        name: string;
    };
    company: {
        id: string;
        name: string;
    };
    reorderLevel: number;
    availableQuantity: number;
    status: "In Stock" | "Low Stock" | "Out of Stock"
}

export type TItems = {
    id: string;
    name: string;
    categoryName: string;
    companyName: string;
    reorderLevel: number;
    availableQuantity: number;
    status: "In Stock" | "Low Stock" | "Out of Stock"
}

export type TGetAllItemsResponse = {
    data: TItems[];
    meta: TMeta
}

export type TGetAllItemForSelectResponse = {
    data: TDropdownSelectItem[]
}

