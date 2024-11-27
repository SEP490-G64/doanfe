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
        inboundPrice: string;
        quantity: string;
    }[];
    targetUnit?: {
        id?: string;
    };
    outboundQuantity?: number;
    price?: number;
}

export interface Outbound {
    index: number;
    id: number;
    outboundCode: string;
    outboundType: "HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO";
    toBranch: {
        id: 1;
        branchName: string;
    };
    fromBranch: {
        id: number;
        branchName: string;
    };
    supplier: {
        id: number;
        supplierName: string;
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
    totalPrice: number;
    outboundDetails: [];
    outboundBatchDetails: [];
}
