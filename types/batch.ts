import { UnitConversion } from "@/types/product";

export type Batch = {
    index: number;
    id: string;
    batchCode: string;
    produceDate: string;
    expireDate: string;
    inboundPrice: string;
    quantity: number;
    baseUnit: string;
    unitConversions?: Array<UnitConversion>;
    actions: string;
};

export type DataSearch = {
    productId?: string;
    keyword?: string;
    produceStartDate?: string;
    produceEndDate?: string;
    expireStartDate?: string;
    expireEndDate?: string;
};
