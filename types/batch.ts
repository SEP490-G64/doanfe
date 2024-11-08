export type Batch = {
    index: number;
    id: string;
    batchCode: string;
    produceDate: string;
    expireDate: string;
    inboundPrice: string;
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
