export interface InventoryReport {
    image?: string;
    index?: number;
    productId?: number;
    registrationCode?: string;
    productName?: string;
    totalQuantity?: number;
    sellableQuantity?: number;
    minQuantity?: number;
    maxQuantity?: number;
    storageLocation?: string;
    unit?: string;
    batches?: InventoryBatchReport[];
}

export interface InventoryBatchReport {
    index?: number;
    batchId?: number;
    batchCode?: string;
    expireDate?: string;
    totalQuantity?: number;
}

export type DataSearch = {
    keyword?: string;
    branchId?: string;
};
