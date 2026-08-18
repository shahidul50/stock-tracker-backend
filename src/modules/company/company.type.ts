import { TDropdownSelectItem, TMeta } from "../../types/common.types";

export type TCompanyResponse = {
    _id: string;
    name: string;
    description: string;
    createdDate: string;
    totalItemLinked: number
};

export type TGetAllCompaniesResponse = {
    data: TCompanyResponse[];
    meta: TMeta;
};

export type TGetAllCompaniesForSelectResponse = {
    data: TDropdownSelectItem[]
}