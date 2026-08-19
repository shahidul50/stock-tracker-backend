import { TMeta } from "../../types/common.types";

export type TSalesReportItem = {
    itemName: string;
    categoryName: string;
    companyName: string;
    totalSoldQty: number;
    soldDate: string;
};

export type TSalesReportResponse = {
    data: TSalesReportItem[];
    meta: TMeta
}
export type TSalesReportForExportResponse = {
    data: TSalesReportItem[];
}

// stock summary report types
export type TStockSummaryItem = {
    itemName: string;
    categoryName: string;
    companyName: string;
    reorderLevel: number;
    availableQty: number;
    status: "In Stock" | "Low Stock" | "Out of Stock";
};

export type TStockSummaryResponse = {
    data: TStockSummaryItem[];
    meta: TMeta
}

export type TStockSummaryForExportResponse = {
    data: TStockSummaryItem[];
}
