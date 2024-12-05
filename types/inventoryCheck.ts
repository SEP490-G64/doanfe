export interface ProductInfor {
    image?: string;
    id?: number;
    registrationCode?: string;
    productName?: string;
    productCode?: string;
    product?: {
        id?: number;
        registrationCode?: string;
        productName?: string;
        productCode?: string;
        lastUpdated?: string;
    };
    productBaseUnit?: {
        id?: number;
        unitName?: string;
    };
    baseUnit?: {
        id?: number;
        unitName?: string;
    };
    batch?: {
        id?: string;
        batchCode?: string;
        expireDate?: string;
    };
    batches?: {
        id?: string;
        batchCode?: string;
        expireDate?: string;
    }[];
    targetUnit?: {
        id?: string;
    };
    systemQuantity?: number;
    countedQuantity?: number;
    difference?: number;
    reason?: string;
}

export interface ProductChangedHistory {
    transactionId: number;
    transactionType: string;
    productId: number;
    productName: string;
    quantity: number;
    batch: string;
    createdAt: string;
}

export interface InventoryCheck {
    index: number;
    id: number;
    code: string;
    branch: {
        id: number;
        branchName: string;
    };
    createdBy: {
        id: number;
        userName: string;
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        status: string;
    };
    createdDate: string | Date;
    status: string;
    inventoryCheckDetails: [];
    inventoryCheckProductDetails: [];
}
export interface InventoryUpdate {
    productIds: number[]; // Adjust this type to match your API response
    inventoryCheckId: number;
    batchIds: number[];
}
